module ShippingMethod
  class Estafeta
    attr_reader :total_weight

    def initialize(total_weight)
      @total_weight = (total_weight.to_f / 1000).ceil
    end

    def calculate_cost!
      cost = PRICES.select { |weight| weight === total_weight }.values&.first || 0

      cost * 100
    end

    PRICES = {
      0 => 0,
      1..5 => 181,
      6 => 192,
      7 => 203,
      8 => 213,
      9 => 224,
      10 => 235,
      11 => 246,
      12 => 256,
      13 => 267,
      14 => 278,
      15 => 288,
      16 => 299,
      17 => 310,
      18 => 321,
      19 => 331,
      20 => 342,
      21 => 353,
      22 => 363,
      23 => 374,
      24 => 385,
      25 => 396,
      26 => 406,
      27 => 417,
      28 => 428,
      29 => 438,
      30 => 449,
      31 => 460,
      32 => 471,
      33 => 481,
      34 => 492,
      35 => 503,
      40..44 => 556,
      45..49 => 610,
      50..54 => 663,
      55..59 => 717,
      60..69 => 771,
      70..Float::INFINITY => 878
    }
  end
end
