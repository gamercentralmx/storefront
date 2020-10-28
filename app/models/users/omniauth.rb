module Users
  class Omniauth
    attr_reader :auth

    def initialize(auth)
      @auth = auth
    end

    def find_or_create!
      return with_ensured_provider! if already_exists?

      create_user!
      create_provider!

      user
    end

    def already_exists?
      User.exists? email: auth.info.email
    end

    def with_ensured_provider!
      create_provider!

      update_user! if missing_info?

      user
    end

    def create_user!
      @user = User.create!(
        last_name: first_name,
        first_name: last_name,
        email: auth.info.email,
        password: Devise.friendly_token[0, 20]
      )
    end

    def update_user!
      user.update(first_name: first_name, last_name: last_name)
    end

    def create_provider!
      provider = user.auth_providers.where(provider: auth.provider, uid: auth.uid).first_or_create
      provider.update(auth: auth)
    end

    def first_name
      auth.info.name.split(' ')[0]
    end

    def last_name
      auth.info.name.split(' ')[1]
    end

    def missing_info?
      user.first_name.nil? or user.last_name.nil?
    end

    def user
      @user ||= User.where(email: auth.info.email).first
    end
  end
end
