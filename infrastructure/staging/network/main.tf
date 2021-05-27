resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr_block

  enable_dns_hostnames = true
}

resource "aws_subnet" "lambda_1" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.lambda_1_subnet_cidr_block
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "lambda_2" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.lambda_2_subnet_cidr_block
  availability_zone = "${var.aws_region}b"
}

resource "aws_subnet" "lambda_1_public" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.lambda_1_public_subnet_cidr_block
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "lambda_2_public" {
  vpc_id = aws_vpc.main.id
  cidr_block = var.lambda_2_public_subnet_cidr_block
  availability_zone = "${var.aws_region}b"
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
}

resource "aws_eip" "nat_1" {}
resource "aws_eip" "nat_2" {}

resource "aws_nat_gateway" "gw_1" {
  allocation_id = aws_eip.nat_1.id
  subnet_id     = aws_subnet.lambda_1_public.id

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_nat_gateway" "gw_2" {
  allocation_id = aws_eip.nat_2.id
  subnet_id     = aws_subnet.lambda_2_public.id

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_1" {
  subnet_id      = aws_subnet.lambda_1_public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
  subnet_id      = aws_subnet.lambda_2_public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private_1" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.gw_1.id
  }
}

resource "aws_route_table" "private_2" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_nat_gateway.gw_2.id
  }
}

resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.lambda_1.id
  route_table_id = aws_route_table.private_1.id
}

resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.lambda_2.id
  route_table_id = aws_route_table.private_2.id
}
