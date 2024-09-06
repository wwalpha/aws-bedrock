import { APIGatewayAuthorizerResult, ConditionBlock, PolicyDocument, Statement } from 'aws-lambda';

type Effect = 'Allow' | 'Deny';

type Method = {
  resourceArn: string;
  conditions?: ConditionBlock;
};

type VerbKey = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'ALL';

export interface ApiOptions {
  region?: string;
  restApiId?: string;
  stage?: string;
}

/**
 * AuthPolicy receives a set of allowed and denied methods and generates a valid
 * AWS policy for the API Gateway authorizer. The constructor receives the calling
 * user principal, the AWS account ID of the API owner, and an apiOptions object.
 * The apiOptions can contain an API Gateway RestApi Id, a region for the RestApi, and a
 * stage that calls should be allowed/denied for. For example
 * {
 *   restApiId: "xxxxxxxxxx",
 *   region: "us-east-1",
 *   stage: "dev"
 * }
 *
 * var testPolicy = new AuthPolicy("[principal user identifier]", "[AWS account id]", apiOptions);
 * testPolicy.allowMethod(AuthPolicy.HttpVerb.GET, "/users/username");
 * testPolicy.denyMethod(AuthPolicy.HttpVerb.POST, "/pets");
 * context.succeed(testPolicy.build());
 *
 * @class AuthPolicy
 * @constructor
 */
export class AuthPolicy {
  /**
   * A set of existing HTTP verbs supported by API Gateway. This property is here
   * only to avoid spelling mistakes in the policy.
   *
   * @property HttpVerb
   * @type {Object}
   */
  public static HttpVerb: Record<VerbKey, string> = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    OPTIONS: 'OPTIONS',
    ALL: '*',
  };

  // The AWS account id the policy will be generated for. This is used to create the method ARNs.
  private awsAccountId: string = '';
  // The principal used for the policy, this should be a unique identifier for the end user.
  private principalId: string = '';
  // The policy version used for the evaluation. This should always be "2012-10-17"
  private version: string = '2012-10-17';
  // The regular expression used to validate resource paths for the policy
  private pathRegex: RegExp = new RegExp('^[/.a-zA-Z0-9-*]+$');
  // the build method processes these lists and generates the approriate statements for the final policy
  private allowMethods: Method[] = [];
  private denyMethods: Method[] = [];
  private restApiId: string = '';
  private region: string = '';
  private stage: string = '';

  constructor(principal: string, awsAccountId: string, apiOptions?: ApiOptions) {
    this.awsAccountId = awsAccountId;
    this.principalId = principal;
    this.restApiId = apiOptions?.restApiId || '*';
    this.region = apiOptions?.region || '*';
    this.stage = apiOptions?.stage || '*';
  }

  /**
   * Adds a method to the internal lists of allowed or denied methods. Each object in
   * the internal list contains a resource ARN and a condition statement. The condition
   * statement can be null.
   *
   * @method addMethod
   * @param {String} effect effect for the policy. This can only be "Allow" or "Deny".
   * @param {String} verb HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {String} resource resource path. For example "/pets"
   * @param {Object} conditions conditions object in the format specified by the AWS docs.
   * @return {void}
   */
  addMethod = (effect: Effect, verb: string, resource: string, conditions?: Record<string, any>): void => {
    if (verb != '*' && !AuthPolicy.HttpVerb.hasOwnProperty(verb)) {
      throw new Error('Invalid HTTP verb ' + verb + '. Allowed verbs in AuthPolicy.HttpVerb');
    }

    if (!this.pathRegex.test(resource)) {
      throw new Error('Invalid resource path: ' + resource + '. Path should match ' + this.pathRegex);
    }

    let cleanedResource = resource;
    if (resource.substring(0, 1) == '/') {
      cleanedResource = resource.substring(1, resource.length);
    }

    const resourceArn = `arn:aws:execute-api:${this.region}:${this.awsAccountId}:${this.restApiId}/${this.stage}/${verb}/${cleanedResource}`;

    if (effect.toLowerCase() == 'allow') {
      this.allowMethods.push({
        resourceArn: resourceArn,
        conditions: conditions,
      });
    } else if (effect.toLowerCase() == 'deny') {
      this.denyMethods.push({
        resourceArn: resourceArn,
        conditions: conditions,
      });
    }
  };

  /**
   * This function loops over an array of objects containing a resourceArn and
   * conditions statement and generates the array of statements for the policy.
   *
   * @method getStatementsForEffect
   * @param {String} effect desired effect. This can be "Allow" or "Deny"
   * @param {Array} methods array of method objects containing the ARN of the resource
   *                and the conditions for the policy
   * @return {Array} an array of formatted statements for the policy.
   */
  getStatementsForEffect = (effect: Effect, methods: Method[]): Statement[] => {
    const statements: Statement[] = [];

    if (methods.length === 0) {
      return statements;
    }

    const hasConditions = methods.filter((item) => item.conditions);
    const noConditions = methods.filter((item) => !item.conditions);

    if (noConditions.length > 0) {
      statements.push({
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: noConditions.map((item) => item.resourceArn),
      });
    }

    hasConditions.forEach((item) => {
      statements.push({
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: [item.resourceArn],
        Condition: item.conditions,
      });
    });

    return statements;
  };

  /**
   * Adds an allow "*" statement to the policy.
   *
   * @method allowAllMethods
   */
  allowAllMethods = () => {
    this.addMethod('Allow', '*', '*');
  };

  /**
   * Adds a deny "*" statement to the policy.
   *
   * @method denyAllMethods
   */
  denyAllMethods = () => {
    this.addMethod('Deny', '*', '*');
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
   * methods for the policy
   *
   * @method allowMethod
   * @param {String} verb HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {string} resource resource path. For example "/pets"
   * @return {void}
   */
  allowMethod = (verb: string, resource: string): void => {
    this.addMethod('Allow', verb, resource);
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of denied
   * methods for the policy
   *
   * @method denyMethod
   * @param {String} verb HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {String} resource resource path. For example "/pets"
   * @return
   */
  denyMethod = (verb: string, resource: string): void => {
    this.addMethod('Deny', verb, resource);
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of allowed
   * methods and includes a condition for the policy statement. More on AWS policy
   * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
   *
   * @method allowMethodWithConditions
   * @param {String} verb HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {string} resource resource path. For example "/pets"
   * @param {Object} conditions conditions object in the format specified by the AWS docs
   * @return {void}
   */
  allowMethodWithConditions = (verb: string, resource: string, conditions: Record<string, any>): void => {
    this.addMethod('Allow', verb, resource, conditions);
  };

  /**
   * Adds an API Gateway method (Http verb + Resource path) to the list of denied
   * methods and includes a condition for the policy statement. More on AWS policy
   * conditions here: http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html#Condition
   *
   * @method denyMethodWithConditions
   * @param {String} verb HTTP verb for the method, this should ideally come from the
   *                 AuthPolicy.HttpVerb object to avoid spelling mistakes
   * @param {string} resource resource path. For example "/pets"
   * @param {Object} conditions conditions object in the format specified by the AWS docs
   * @return {void}
   */
  denyMethodWithConditions = (verb: string, resource: string, conditions: Record<string, any>): void => {
    this.addMethod('Deny', verb, resource, conditions);
  };

  /**
   * Generates the policy document based on the internal lists of allowed and denied
   * conditions. This will generate a policy with two main statements for the effect:
   * one statement for Allow and one statement for Deny.
   * Methods that includes conditions will have their own statement in the policy.
   *
   * @method build
   * @return {Object} The policy object that can be serialized to JSON.
   */
  build = (): APIGatewayAuthorizerResult => {
    if (
      (!this.allowMethods || this.allowMethods.length === 0) &&
      (!this.denyMethods || this.denyMethods.length === 0)
    ) {
      throw new Error('No statements defined for the policy');
    }

    const doc: PolicyDocument = {
      Version: this.version,
      Statement: [
        ...this.getStatementsForEffect('Allow', this.allowMethods),
        ...this.getStatementsForEffect('Deny', this.denyMethods),
      ],
    };

    return {
      policyDocument: doc,
      principalId: this.principalId,
    };
  };
}
