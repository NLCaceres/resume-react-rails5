class PostImage < ApplicationRecord
  belongs_to :post, counter_cache: true
  def self.select_without(*columns)
    select(column_names - columns.map(&:to_s))
  end
end
