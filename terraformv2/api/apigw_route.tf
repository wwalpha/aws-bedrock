# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats GET
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_get" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /chats"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats POST
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_post" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /chats"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats/{chatId} GET
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_get" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /chats/{chatId}"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats/{chatId} DELETE
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_delete" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "DELETE /chats/{chatId}"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats/{chatId}/feedbacks POST
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_feedbacks_post" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /chats/{chatId}/feedbacks"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats/{chatId}/messages POST
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_messages_post" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /chats/{chatId}/messages"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats/{chatId}/messages GET
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_messages_get" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /chats/{chatId}/messages"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - chats/{chatId}/title PUT
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_messages_put" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "PUT /chats/{chatId}/title"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - file/{fileName} DELETE
# ---------------------------------------------------------------------------------------------
# resource "aws_apigatewayv2_route" "file_filename_delete" {
#   api_id             = aws_apigatewayv2_api.this.id
#   route_key          = "DELETE file/{fileName}"
#   target             = "integrations/${local.apigw_integration_id_backend}"
#   authorization_type = "CUSTOM"
#   authorizer_id      = aws_apigatewayv2_authorizer.this.id
# }
