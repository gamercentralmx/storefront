if defined? Rack::Cors
  Rails.configuration.middleware.insert_before 0, Rack::Cors do
    allow do
      origins %w[https://gamercentral.mx]
      resource '/assets/*'
    end
  end
end
