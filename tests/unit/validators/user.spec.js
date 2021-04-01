const usernameSchema = require('../../../src/validators/username.validator')
const userSchema = require('../../../src/validators/user.validator')

describe('User Schema Validation Testing', () => {
  describe('username schema', () => {
    const generalCondition = `
        Should return a string alpha-numeric, 
        minimum length of 3, maximum of 30 
        and it is required(must be provided)
    `
    it(generalCondition, () => {
      const test = {
        username: 'ade345',
      }
      const { error } = usernameSchema.validate(test)
      expect(error).toBeUndefined()
    })

    it('Should return an error because username lesser than 3 characters', () => {
      const test = {
        username: 'ex',
      }
      const { error } = usernameSchema.validate(test)
      expect(error).not.toBeUndefined()
      expect(error.details[0].message).toBe(
        '"username" length must be at least 3 characters long',
      )
    })

    it('Should return an error because username greater than 30 characters', () => {
      const test = {
        username: 'qwerqweoplkjhgfdsazxcvbmnssssshshhssss',
      }
      const { error } = usernameSchema.validate(test)
      expect(error).not.toBeNull()
      expect(error.details[0].message).toBe(
        '"username" length must be less than or equal to 30 characters long',
      )
    })

    it("Should return an  because username wasn't provided ", () => {
      const test = {}
      const { error } = usernameSchema.validate(test)
      console.log('2>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', error.details)
      expect(error).not.toBeNull()
      expect(error.details[0].message).toBe('"username" is required')
    })

    it('Should return a string alpha-numeric, minimum length of 3, maximum of 30 and it is required', () => {
      const test = {
        username: 'ex',
      }
      const { error } = usernameSchema.validate(test)
      expect(error).not.toBeNull()
      expect(error.details[0].message).toBe(
        '"username" length must be at least 3 characters long',
      )
    })
  })
})
