class InvoiceInfo < ApplicationRecord
  belongs_to :user
  belongs_to :address
end
