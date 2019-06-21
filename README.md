# wtest_graphql

## Use case
Services to deposit/transfer money

## Entity
User, Bank, Account, and Transfer

## Securing API
Access token generated after create new user :
```
{
  "data": {
    "createUser": {
      "id": "1",
      "email": "a@a.com",
      "name": "Ikromy Wallex",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhQGEuY29tIiwibmFtZSI6Iklrcm9teSBXYWxsZXgiLCJjcmVhdGVkQXQiOiIyMDE5LTA2LTIxVDEwOjAxOjEzLjAwMFoiLCJ1cGRhdGVkQXQiOm51bGwsImlhdCI6MTU2MTExMTI3M30.nXESuXARngdFiApb068347F16GOy82fsfRJ23CJTfG8"
    }
  }
}
```
Token can be set on query `?access_token=token` or using header `Authorization: Bearer token`

## Graphql endpoint
`http://localhost:9999/graphql`

## Balance calculated
1. create/update account to deposit
2. createTransfer or deleteTransfer also changes balance

calculated balance using mysql trigger
