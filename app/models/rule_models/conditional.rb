# Contains mapping values for the Criterion comparison operators.
class Conditional < ActiveRecord::Base
  has_many :criteria

  validates :name, :presence=>true, :uniqueness=>true
end

# == Schema Information
# Schema version: 20110420193126
#
# Table name: conditionals
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)     not null
#  created_at :datetime
#  updated_at :datetime

# placed here for informational purposes only:
#  Conditional.create! :id=>1, :name=>"="
#  Conditional.create! :id=>2, :name=>"!="
#  Conditional.create! :id=>3, :name=>"contains"
#  Conditional.create! :id=>4, :name=>"does not contain"
#  Conditional.create! :id=>5, :name=>"<"
#  Conditional.create! :id=>6, :name=>"<="
#  Conditional.create! :id=>7, :name=>">="
#  Conditional.create! :id=>8, :name=>">"
#  Conditional.create! :id=>9, :name=>"empty"
#  Conditional.create! :id=>10, :name=>"not empty"
