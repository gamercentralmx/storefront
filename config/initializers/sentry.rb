if Rails.env.production?
  Raven.configure do |config|
    config.dsn = ENV['SENTRY_DSN']
    config.current_environment = Rails.env
    config.environments = ['production']
    config.excluded_exceptions = [ActionController::RoutingError]

    config.sanitize_fields = Rails.application.config.filter_parameters.map(&:to_s)
  end
end
