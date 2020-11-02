class Address < ApplicationRecord
  belongs_to :user
  has_many :orders, dependent: :nullify
  has_many :invoice_infos, dependent: :nullify

  enum type: {
    billing: 'billing',
    shipping: 'shipping',
    both: 'both'
  }
end
