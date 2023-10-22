locals {
  suffix = random_id.this.hex
  prefix = "bedrock"
}

resource "random_id" "this" {
  byte_length = 4
}
