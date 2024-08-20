# ---------------------------------------------------------------------------------------------
# API Gateway
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_rest_api" "this" {
  name = "${var.prefix}_api"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Authorizer 
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_authorizer" "this" {
  name            = "cognito"
  rest_api_id     = aws_api_gateway_rest_api.this.id
  type            = "COGNITO_USER_POOLS"
  provider_arns   = [aws_cognito_user_pool.this.arn]
  identity_source = "method.request.header.Authorization"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Account 
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_account" "this" {
  cloudwatch_role_arn = aws_iam_role.apigw_cloudwatch_logs.arn
}

data "aws_iam_policy_document" "apigw_cloudwatch_logs" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["apigateway.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Deployment
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id

  # triggers = {
  #   redeployment = sha1(jsonencode(aws_api_gateway_rest_api.this.body))
  # }

  lifecycle {
    create_before_destroy = true
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Stage 
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.this.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = "api"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - root OPTIONS
# ---------------------------------------------------------------------------------------------
module "root_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_rest_api.this.root_resource_id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - predict
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "predict" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "predict"

  lifecycle {
    create_before_destroy = true
  }
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - predict OPTIONS
# ---------------------------------------------------------------------------------------------
module "predict_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.predict.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - predict POST
# ---------------------------------------------------------------------------------------------
module "predict_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.predict.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.predict.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - Predict Title
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "predict_title" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.predict.id
  path_part   = "title"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - predict/title OPTIONS
# ---------------------------------------------------------------------------------------------
module "predict_title_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.predict_title.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - predict/title POST
# ---------------------------------------------------------------------------------------------
module "predict_title_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.predict_title.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.predict_title.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - Chats
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "chats" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "chats"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - chats OPTIONS
# ---------------------------------------------------------------------------------------------
module "chats_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.chats.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - chats POST
# ---------------------------------------------------------------------------------------------
module "chats_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chats.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.create_chat.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - chats GET
# ---------------------------------------------------------------------------------------------
module "chats_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chats.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.list_chats.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "chat_chatid" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.chats.id
  path_part   = "{chatId}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid} OPTIONS
# ---------------------------------------------------------------------------------------------
module "chat_chatid_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.chat_chatid.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid} GET
# ---------------------------------------------------------------------------------------------
module "chat_chatid_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chat_chatid.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.find_chat_by_id.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid} DELETE
# ---------------------------------------------------------------------------------------------
module "chat_chatid_delete" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chat_chatid.id
  http_method       = "DELETE"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.delete_chat.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/feedbacks
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "chat_chatid_feedbacks" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.chat_chatid.id
  path_part   = "feedbacks"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/feedbacks OPTIONS
# ---------------------------------------------------------------------------------------------
module "chat_chatid_feedback_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.chat_chatid_feedbacks.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/feedbacks POST
# ---------------------------------------------------------------------------------------------
module "chat_chatid_feedback_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chat_chatid_feedbacks.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.update_feedback.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/messages
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "chat_chatid_messages" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.chat_chatid.id
  path_part   = "messages"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/messages OPTIONS
# ---------------------------------------------------------------------------------------------
module "chat_chatid_messages_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.chat_chatid_messages.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/messages GET
# ---------------------------------------------------------------------------------------------
module "chat_chatid_messages_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chat_chatid_messages.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.list_messages.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/messages POST
# ---------------------------------------------------------------------------------------------
module "chat_chatid_messages_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chat_chatid_messages.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.create_message.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/title
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "chat_chatid_title" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.chat_chatid.id
  path_part   = "title"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/title OPTIONS
# ---------------------------------------------------------------------------------------------
module "chat_chatid_title_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.chat_chatid_title.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - chats/{chatid}/messages PUT
# ---------------------------------------------------------------------------------------------
module "chat_chatid_title_put" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.chat_chatid_title.id
  http_method       = "PUT"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.update_chat_title.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - file
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "file" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "file"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - file OPTIONS
# ---------------------------------------------------------------------------------------------
module "file_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.file.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - file/{fileName}
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "file_filename" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.file.id
  path_part   = "{fileName}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - file/{fileName} OPTIONS
# ---------------------------------------------------------------------------------------------
module "file_filename_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.file_filename.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - file/{filename} DELETE
# ---------------------------------------------------------------------------------------------
module "file_filename_delete" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.file_filename.id
  http_method       = "DELETE"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.delete_file_function.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - file/url
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "file_url" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.file.id
  path_part   = "url"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - file/url OPTIONS
# ---------------------------------------------------------------------------------------------
module "file_url_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.file_url.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - file/url GET
# ---------------------------------------------------------------------------------------------
module "file_url_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.file_url.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.get_file_download_signed_url.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - file/url POST
# ---------------------------------------------------------------------------------------------
module "file_url_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.file_url.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.get_signed_url.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - image
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "image" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "image"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - image OPTIONS
# ---------------------------------------------------------------------------------------------
module "image_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.image.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - image/generate
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "image_generate" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.image.id
  path_part   = "generate"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - image/generate OPTIONS
# ---------------------------------------------------------------------------------------------
module "image_generate_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.image_generate.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - image/generate POST
# ---------------------------------------------------------------------------------------------
module "image_generate_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.image_generate.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.generate_image.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "shares" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "shares"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares OPTIONS
# ---------------------------------------------------------------------------------------------
module "shares_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.shares.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares/chat
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "shares_chat" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.shares.id
  path_part   = "chat"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares/chat OPTIONS
# ---------------------------------------------------------------------------------------------
module "shares_chat_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.shares_chat.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares/chat/{chatId}
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "shares_chat_chatid" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.shares_chat.id
  path_part   = "{chatId}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - shares/chat/{chatId} GET
# ---------------------------------------------------------------------------------------------
module "shares_chat_chatid_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.shares_chat_chatid.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.find_share_id.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - shares/chat/{chatId} POST
# ---------------------------------------------------------------------------------------------
module "shares_chat_chatid_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.shares_chat_chatid.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.create_share_id.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares/chat/{chatId} OPTIONS
# ---------------------------------------------------------------------------------------------
module "shares_chat_chatid_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.shares_chat_chatid.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares/share
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "shares_share" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.shares.id
  path_part   = "share"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares/share OPTIONS
# ---------------------------------------------------------------------------------------------
module "shares_share_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.shares_share.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - shares/share/{shareId}
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "shares_share_shareid" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.shares_share.id
  path_part   = "{shareId}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - shares/share/{shareId} OPTIONS
# ---------------------------------------------------------------------------------------------
module "shares_share_shareid_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.shares_share_shareid.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - shares/share/{shareId} DELETE
# ---------------------------------------------------------------------------------------------
module "shares_share_shareid_delete" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.shares_share_shareid.id
  http_method       = "DELETE"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.delete_share_id.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - shares/share/{shareId} GET
# ---------------------------------------------------------------------------------------------
module "shares_share_shareid_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.shares_share_shareid.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.get_shared_chat.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - systemcontexts
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "systemcontexts" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "systemcontexts"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - systemcontexts OPTIONS
# ---------------------------------------------------------------------------------------------
module "systemcontexts_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.systemcontexts.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - systemcontexts GET
# ---------------------------------------------------------------------------------------------
module "systemcontexts_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.systemcontexts.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.list_system_contexts.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - systemcontexts POST
# ---------------------------------------------------------------------------------------------
module "systemcontexts_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.systemcontexts.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.create_system_contexts.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - systemcontexts/{systemContextId}
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "systemcontexts_systemContextid" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.systemcontexts.id
  path_part   = "{systemContextId}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - systemcontexts/{systemContextId} OPTIONS
# ---------------------------------------------------------------------------------------------
module "systemcontexts_systemContextid_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.systemcontexts_systemContextid.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - systemcontexts/{systemContextId} DELETE
# ---------------------------------------------------------------------------------------------
module "systemcontexts_systemContextid_delete" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.systemcontexts_systemContextid.id
  http_method       = "DELETE"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.delete_system_contexts.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - systemcontexts/{systemContextId}/title
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "systemcontexts_systemContextid_title" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.systemcontexts_systemContextid.id
  path_part   = "title"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - systemcontexts/{systemContextId}/title OPTIONS
# ---------------------------------------------------------------------------------------------
module "systemcontexts_systemContextid_title_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.systemcontexts_systemContextid_title.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - systemcontexts/{systemContextId} PUT
# ---------------------------------------------------------------------------------------------
module "systemcontexts_systemContextid_title_put" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.systemcontexts_systemContextid_title.id
  http_method       = "PUT"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = aws_lambda_function.update_system_context_title.invoke_arn
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "transcribe" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "transcribe"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe OPTIONS
# ---------------------------------------------------------------------------------------------
module "transcribe_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.transcribe.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/result
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "transcribe_result" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.transcribe.id
  path_part   = "result"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/result OPTIONS
# ---------------------------------------------------------------------------------------------
module "transcribe_result_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.transcribe_result.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/result/{jobName}
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "transcribe_result_jobname" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.transcribe_result.id
  path_part   = "{jobName}"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/result/{jobName} OPTIONS
# ---------------------------------------------------------------------------------------------
module "transcribe_result_jobname_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.transcribe_result_jobname.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - transcribe/result/{jobName} GET
# ---------------------------------------------------------------------------------------------
module "transcribe_result_jobname_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.transcribe_result_jobname.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = "aws_lambda_function.get_transcribe_result.invoke_arn"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/start
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "transcribe_start" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.transcribe.id
  path_part   = "start"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/start OPTIONS
# ---------------------------------------------------------------------------------------------
module "transcribe_start_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.transcribe_start.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - transcribe/start POST
# ---------------------------------------------------------------------------------------------
module "transcribe_start_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.transcribe_start.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = "aws_lambda_function.transcribe_start.invoke_arn"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/url
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "transcribe_url" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.transcribe.id
  path_part   = "url"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - transcribe/url OPTIONS
# ---------------------------------------------------------------------------------------------
module "transcribe_url_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.transcribe_url.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - transcribe/url POST
# ---------------------------------------------------------------------------------------------
module "transcribe_url_post" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.transcribe_url.id
  http_method       = "POST"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = "aws_lambda_function.transcribe_url.invoke_arn"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Resource - web-text
# ---------------------------------------------------------------------------------------------
resource "aws_api_gateway_resource" "webtext" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "web-text"
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - web-text OPTIONS
# ---------------------------------------------------------------------------------------------
module "webtext_options" {
  source      = "./options"
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.webtext.id
}

# ---------------------------------------------------------------------------------------------
# API Gateway Method - web-text GET
# ---------------------------------------------------------------------------------------------
module "webtext_get" {
  source            = "./methods"
  rest_api_id       = aws_api_gateway_rest_api.this.id
  resource_id       = aws_api_gateway_resource.webtext.id
  http_method       = "GET"
  authorizer_id     = aws_api_gateway_authorizer.this.id
  lambda_invoke_arn = "aws_lambda_function.webtext.invoke_arn"
}
