#!/usr/bin/env ruby
#
# Fetch Health Authority Specific Environment for github actions
#

require "open3"

ACCESS_TOKEN = ARGV[0]

def fetch_env
  source = ".env.bt"
  env_url =
  "https://#{ACCESS_TOKEN}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/environment/github/.env.bt"

  open(source, 'w') do |f|
    Open3.popen2e("curl", "-s", env_url) do |_, stdout_and_err, wait_thr|
      stdout_and_err.each do |line|
        f << line 
      end
      wait_thr.value
    end
  end
end

fetch_env
