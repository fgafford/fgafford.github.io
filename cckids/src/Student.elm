module Student exposing (Student)

import Date exposing (..)

type alias Student = 
  { firstName: String
  , lastName: String
  , birthday: Date
  , sex: Sex
  }

type Sex = Male | Female

fullName : Student -> String
fullName kid =
  kid.firstName ++ " " ++ kid.lastName

-- age : Student -> Int


-- hasBirthdaySoon: Student -> Bool