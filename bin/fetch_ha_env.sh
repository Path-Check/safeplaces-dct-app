#!/usr/bin/env ruby
#
# Fetch Health Authority Specific Environment
#
# Usage
#
#   bin/fetch_env <health-authority-label>
#
# Example
#
#   bin/fetch_env pc
#
# Requirements
#
# 1. Remote access to the environment repo
# 2. A github personal access token saved in `.env`:
#    https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

require "open3"
require 'dotenv'
Dotenv.load

HA_LABEL = ARGV[0]

def fetch_env
  token = ENV.fetch("ACCESS_TOKEN")

  if !valid_token(token) then
    puts "No valid github token set"
    puts "Set a valid token in your .env file"
    exit
  end

  if !HA_LABEL then
    puts "No HA label provided"
    puts "provide a label as a parameter e.g. $ bin/fetch_ha_env.sh pc"
    exit
  end

  puts "...fetching .env for #{HA_LABEL}"

  source = ".env.bt"
  env_url =
  "https://#{token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/environment/#{HA_LABEL}/.env.bt"

  open(source, 'w') do |f|
    Open3.popen2e("curl", "-s", env_url) do |_, stdout_and_err, wait_thr|
      stdout_and_err.each do |line|
        f << line 
      end
      wait_thr.value
    end
  end
  puts "\nfinished fetching .env for #{HA_LABEL}"
end

def valid_token(token) 
  token.length == 40
end

fetch_env
