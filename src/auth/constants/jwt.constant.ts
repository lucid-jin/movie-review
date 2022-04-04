const jwtConstant = () => ({
  secret: process.env['JWT_KEY']
})

export default jwtConstant;