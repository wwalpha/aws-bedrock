# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /chats
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_get" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /chats"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /chats
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_post" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /chats"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET chats/{chatId}
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_get" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /chats/{chatId}"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - DELETE chats/{chatId}
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_delete" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "DELETE /chats/{chatId}"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /chats/{chatId}/feedbacks 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_feedbacks_post" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /chats/{chatId}/feedbacks"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /chats/{chatId}/messages 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_messages_post" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /chats/{chatId}/messages"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET chats/{chatId}/messages 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_messages_get" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /chats/{chatId}/messages"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - PUT /chats/{chatId}/title 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "chats_chatid_messages_put" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "PUT /chats/{chatId}/title"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - DELETE /file/{fileName} 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "file_filename_delete" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "DELETE /file/{fileName}"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /file/url 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "file_url_get" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /file/url"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id

  lifecycle {
    create_before_destroy = true
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /file/url 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "file_url_post" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /file/url"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /image/generate 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "image_generate_post" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /image/generate"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /predict 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "predict_post" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /predict"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /predict/title 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "predict_title_post" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /predict/title"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /rag/query 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "rag_query_post" {
  depends_on         = [aws_apigatewayv2_integration.rag]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /rag/query"
  target             = "integrations/${aws_apigatewayv2_integration.rag.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /rag/retrieve 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "rag_retrieve_post" {
  depends_on         = [aws_apigatewayv2_integration.rag]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /rag/retrieve"
  target             = "integrations/${aws_apigatewayv2_integration.rag.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /shares/chat/{chatId} 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "shares_chat_chatid_post" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /shares/chat/{chatId}"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /shares/chat/{chatId} 
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "shares_chat_chatid_get" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /shares/chat/{chatId}"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET shares/share/{shareId}
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "shares_share_shareid_get" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /shares/share/{shareId}"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - DELETE shares/share/{shareId}
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "shares_share_shareid_delete" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "DELETE /shares/share/{shareId}"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /systemcontexts
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "systemcontexts_get" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /systemcontexts"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /systemcontexts
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "systemcontexts_post" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /systemcontexts"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - DELETE /systemcontexts/{systemContextId}
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "systemcontexts_systemContextid_delete" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "DELETE /systemcontexts/{systemContextId}"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - PUT /systemcontexts/{systemContextId}/title
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "systemcontexts_systemContextid_title_put" {
  depends_on         = [aws_apigatewayv2_integration.chat]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "PUT /systemcontexts/{systemContextId}/title"
  target             = "integrations/${aws_apigatewayv2_integration.chat.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /transcribe/result/{jobName}
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "transcribe_result_jobname_get" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /transcribe/result/{jobName}"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /transcribe/start
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "transcribe_start_post" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /transcribe/start"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - POST /transcribe/url
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "transcribe_url_post" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "POST /transcribe/url"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Route - GET /web-text
# ---------------------------------------------------------------------------------------------
resource "aws_apigatewayv2_route" "webtext_get" {
  depends_on         = [aws_apigatewayv2_integration.functions]
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /web-text"
  target             = "integrations/${aws_apigatewayv2_integration.functions.id}"
  authorization_type = "CUSTOM"
  authorizer_id      = aws_apigatewayv2_authorizer.this.id

  lifecycle {
    create_before_destroy = true
  }
}
