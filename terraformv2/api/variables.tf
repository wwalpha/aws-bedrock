variable "prefix" {
  type = string
}

variable "bucket_name_artifact" {
  type = string
}

variable "service_discovery_service_chat_arn" {
  type = string
}

variable "service_discovery_service_functions_arn" {
  type = string
}

variable "service_discovery_service_rag_arn" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "vpc_private_subnets" {
  type = list(string)
}
