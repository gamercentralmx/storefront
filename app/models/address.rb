class Address < ApplicationRecord
  belongs_to :user
  has_many :orders, dependent: :nullify
  has_many :invoice_infos, dependent: :nullify

  enum kind: {
    billing: 'billing',
    shipping: 'shipping',
    invoicing: 'invoicing'
  }
end
