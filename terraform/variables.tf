variable "allow_ip_addresses" {
  type    = list(string)
  default = ["202.32.14.177/32"]
}

variable "rag_enable" {
  default = false
}
