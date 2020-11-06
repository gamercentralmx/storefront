class Address < ApplicationRecord
  belongs_to :user
  has_many :orders, dependent: :nullify

  enum kind: {
    billing: 'billing',
    shipping: 'shipping',
    invoicing: 'invoicing'
  }

  STATES = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chihuahua',
    'Chiapas',
    'Coahuila',
    'Colima',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
    'Ciudad de México'
  ]

  BUSINESS_TYPES = [
    'Persona Física',
    'Persona Moral'
  ]
end
