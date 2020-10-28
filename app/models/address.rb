class Address < ApplicationRecord
  belongs_to :user
  has_many :orders, dependent: :nullify

  enum :type, {
    billing: 'billing',
    shipping: 'shipping',
    both: 'both'
  }
end
