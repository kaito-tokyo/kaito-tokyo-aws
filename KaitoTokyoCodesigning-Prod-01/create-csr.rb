#!/usr/bin/env ruby
# frozen_string_literal: true

# SPDX-FileCopyrightText: 2026 Kaito Udagawa <umireon@kaito.tokyo>
#
# SPDX-License-Identifier: Apache-2.0

require "base64"
require "digest"
require "json"
require "openssl"

SIGNING_ALGORITHM = "RSASSA_PKCS1_V1_5_SHA_256"

KMS_KEY_IDS = {
  "application" => "alias/kaito-tokyo/developer-id-application",
  "installer" => "alias/kaito-tokyo/developer-id-installer"
}.freeze

usage = "Usage: #{$PROGRAM_NAME} application|installer"
csr_kind = ARGV.fetch(0) { abort usage }
kms_key_id = KMS_KEY_IDS.fetch(csr_kind) { abort usage }

print "Email Address: "
email_address = STDIN.gets.strip
abort "Error: Email Address is required" if email_address.nil? || email_address.empty?

print "Common Name: "
common_name = STDIN.gets.strip
abort "Error: Common Name is required" if common_name.nil? || common_name.empty?

print "Country Name: "
country_name = STDIN.gets.strip
abort "Error: Country Name is required" if country_name.nil? || country_name.empty?
abort "Error: Country Name must be a 2-letter country code" unless country_name.match?(/\A[A-Z]{2}\z/)

key_metadata_json = `aws kms get-public-key --key-id #{kms_key_id} --output json`
abort "Error: aws kms get-public-key failed" unless $?.success?

key_metadata = JSON.parse(key_metadata_json)

subject_public_key_info = OpenSSL::ASN1.decode(Base64.decode64(key_metadata["PublicKey"]))

# PKCS#10 attributes are [0] IMPLICIT and may be empty.
empty_attributes = OpenSSL::ASN1::ASN1Data.new([], 0, :CONTEXT_SPECIFIC)

certification_request_info = OpenSSL::ASN1::Sequence([
  OpenSSL::ASN1::Integer(0),
  OpenSSL::ASN1::Sequence([
    OpenSSL::ASN1::Set([
      OpenSSL::ASN1::Sequence([
        OpenSSL::ASN1::ObjectId("emailAddress"),
        OpenSSL::ASN1::IA5String(email_address)
      ])
    ]),
    OpenSSL::ASN1::Set([
      OpenSSL::ASN1::Sequence([
        OpenSSL::ASN1::ObjectId("commonName"),
        OpenSSL::ASN1::UTF8String(common_name)
      ])
    ]),
    OpenSSL::ASN1::Set([
      OpenSSL::ASN1::Sequence([
        OpenSSL::ASN1::ObjectId("countryName"),
        OpenSSL::ASN1::PrintableString(country_name)
      ])
    ])
  ]),
  subject_public_key_info,
  empty_attributes
])

request_info_der = certification_request_info.to_der
request_info_digest = Digest::SHA256.digest(request_info_der)
csr_path = "developer-id-#{csr_kind}.csr"
digest_path = "#{csr_path}.sha256"

File.binwrite(digest_path, request_info_digest)

signature_base64 = `aws kms sign --key-id #{kms_key_id} --message fileb://#{digest_path} --message-type DIGEST --signing-algorithm #{SIGNING_ALGORITHM} --output json`
abort "Error: aws kms sign failed" unless $?.success?

signature = Base64.decode64(JSON.parse(signature_base64)["Signature"])

csr = OpenSSL::ASN1::Sequence([
  certification_request_info,
  OpenSSL::ASN1::Sequence([
    OpenSSL::ASN1::ObjectId("sha256WithRSAEncryption"),
    OpenSSL::ASN1::Null(nil)
  ]),
  OpenSSL::ASN1::BitString(signature)
])

csr_base64 = Base64.strict_encode64(csr.to_der).scan(/.{1,64}/).join("\n")
File.write(csr_path, "-----BEGIN CERTIFICATE REQUEST-----\n#{csr_base64}\n-----END CERTIFICATE REQUEST-----\n")
