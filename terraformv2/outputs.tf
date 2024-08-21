output "api_endpoint" {
  value = module.api.api_endpoint
}

output "region" {
  value = local.region
}

output "user_pool_id" {
  value = module.auth.cognito_user_pool_id
}

output "user_pool_client_id" {
  value = module.auth.cognito_user_pool_client_id
}

output "identity_pool_id" {
  value = module.auth.cognito_identity_pool_id
}

output "bucket_name_artifacts" {
  value = aws_s3_bucket.artifact.bucket
}

output "bucket_name_frontend" {
  value = module.cdn.bucket_name_frontend
}

output "cloudfront_url" {
  value = "https://${module.cdn.cloudfront_url}"
}

# output "predict_stream_function_arn" {
#   value = module.predict_stream.function_arn
# }


# output "rag_enabled" {
#   value = var.rag_enabled
# }

# output "rag_knowledge_base_enabled" {
#   value = var.rag_knowledge_base_enabled
# }

# output "agent_enabled" {
#   value = var.agent_enabled
# }

# output "self_sign_up_enabled" {
#   value = var.self_sign_up_enabled
# }

# output "model_region" {
#   value = var.model_region
# }

# output "model_ids" {
#   value = var.model_ids
# }

# output "multi_modal_model_ids" {
#   value = var.multi_modal_model_ids
# }

# output "image_model_ids" {
#   value = var.image_model_ids
# }

# output "endpoint_names" {
#   value = var.endpoint_names
# }

# output "samlauth_enabled" {
#   value = var.samlauth_enabled
# }

# output "saml_cognito_domain_name" {
#   value = var.saml_cognito_domain_name
# }

# output "saml_cognito_federated_identity_provider_name" {
#   value = var.saml_cognito_federated_identity_provider_name
# }

# output "agent_names" {
#   value = var.agent_names
# }

# output "recognize_file_enabled" {
#   value = var.recognize_file_enabled
# }
