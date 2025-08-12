# ----------------------------------------------------------------------------------------------
# Amazon API Gateway - HTTP API
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "this" {
  name          = "${local.prefix}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = local.api_allow_origins_dev
    allow_headers = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway Authorizer (JWT Cognito)
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "this" {
  api_id           = aws_apigatewayv2_api.this.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "Cognito"

  jwt_configuration {
    audience = [
      aws_cognito_user_pool.this.id,
    ]
    issuer = "https://${aws_cognito_user_pool.this.endpoint}"
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway VPC Link
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_vpc_link" "this" {
  name               = "${local.prefix}-vpclink"
  security_group_ids = [module.sg_vpc_link.security_group_id]
  subnet_ids         = var.vpc_subnets
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway Stage ($default)
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api.arn
    format = jsonencode(
      {
        apiId              = "$context.apiId"
        httpMethod         = "$context.httpMethod"
        ip                 = "$context.identity.sourceIp"
        protocol           = "$context.protocol"
        requestId          = "$context.requestId"
        requestTime        = "$context.requestTime"
        responseLength     = "$context.responseLength"
        responseLatency    = "$context.responseLatency"
        routeKey           = "$context.routeKey"
        integrationLatency = "$context.integrationLatency"
        status             = "$context.status"
        error              = "$context.authorizer.error"
      }
    )
  }
}

# ----------------------------------------------------------------------------------------------
# AWS Service Discovery Service - Auth
# ----------------------------------------------------------------------------------------------
data "aws_service_discovery_service" "auth" {
  name         = aws_ecs_service.auth.service_connect_configuration[0].service[0].discovery_name
  namespace_id = aws_service_discovery_http_namespace.auth.id
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway Integration - VPC_LINK (Auth)
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "auth" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = data.aws_service_discovery_service.auth.arn

  # Forward the full '/auth/{proxy+}' path to the backend
  request_parameters = {
    "overwrite:path" = "/auth/$request.path.proxy"
  }
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway Route - Auth POST
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "auth_post" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "POST /auth/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway Route - Auth GET
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "auth_get" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /auth/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway Route - Auth PUT
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "auth_put" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "PUT /auth/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

# ----------------------------------------------------------------------------------------------
# Amazon API Gateway Route - Auth DELETE
# ----------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "auth_delete" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "DELETE /auth/{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}
