class DeviseCustomMailer < Devise::Mailer
  helper :application
  layout 'mailer'

  before_action :add_inline_attachment!

  private

  def add_inline_attachment!
    attachments.inline['logo.png'] = File.read(File.join(Rails.root, 'app', 'assets', 'images', 'logo.png'))
  end
end
