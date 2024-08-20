# ---------------------------------------------------------------------------------------------
# API Gateway Method - OPTIONS
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_method" "this" {
  rest_api_id   = var.rest_api_id
  resource_id   = var.resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration - OPTIONS
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_integration" "this" {
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.this.http_method
  type        = "MOCK"
  request_templates = {
    "application/json" = "{ \"statusCode\": 200 }"
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method Response - OPTIONS
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_method_response" "this" {
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.this.http_method
  status_code = "204"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Integration Response - OPTIONS
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_integration_response" "this" {
  depends_on  = [aws_api_gateway_integration.this]
  rest_api_id = var.rest_api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.this.http_method
  status_code = aws_api_gateway_method_response.this.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}
