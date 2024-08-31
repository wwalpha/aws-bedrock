variable "prefix" {
  type = string
}

variable "bucket_name_artifact" {
  type = string
}

variable "service_discovery_service_chat_arn" {
  type = string
}

variable "service_discovery_service_webtext_arn" {
  type = string
}

variable "service_discovery_service_transcribe_arn" {
  type = string
}

variable "service_discovery_service_systemcontexts_arn" {
  type = string
}

variable "service_discovery_service_share_arn" {
  type = string
}

variable "service_discovery_service_rag_arn" {
  type = string
}

variable "service_discovery_service_predict_arn" {
  type = string
}

variable "service_discovery_service_image_arn" {
  type = string
}

variable "service_discovery_service_file_arn" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "vpc_private_subnets" {
  type = list(string)
}
