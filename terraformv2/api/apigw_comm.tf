# ---------------------------------------------------------------------------------------------
# API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_api" "this" {
  name          = "${var.prefix}-http-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer - Authorization(API)
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_authorizer" "this" {
  name                              = "Authorizer"
  api_id                            = aws_apigatewayv2_api.this.id
  authorizer_type                   = "REQUEST"
  authorizer_uri                    = aws_lambda_function.authorizer_v2.invoke_arn
  authorizer_payload_format_version = "2.0"
  enable_simple_responses           = false
  authorizer_result_ttl_in_seconds  = 300
  identity_sources                  = ["$request.header.Authorization"]
}

# ---------------------------------------------------------------------------------------------
# API Gateway Stage
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_stage" "this" {
  depends_on  = [aws_cloudwatch_log_group.api]
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

# ---------------------------------------------------------------------------------------------
# API Gateway VPC Link
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_vpc_link" "this" {
  name               = "${var.prefix}-vpclink"
  security_group_ids = [aws_security_group.private_link.id]
  subnet_ids         = module.vpc.private_subnets
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - Chat
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_integration" "chat" {
  api_id             = aws_apigatewayv2_api.this.id
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.this.id
  integration_method = "ANY"
  integration_type   = "HTTP_PROXY"
  integration_uri    = aws_service_discovery_service.chat.arn

  # request_parameters = {
  #   "append:header.username" = "$context.authorizer.username"
  #   "append:header.guardian" = "$context.authorizer.guardian"
  # }
}
