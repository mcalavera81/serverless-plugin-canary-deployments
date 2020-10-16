module.exports.hello = async (event, context) => {
  if ((event.queryStringParameters || {}).error) throw new Error('Oh no!')
  console.log('The 13th version')
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'The 13th version'
    })
  }
  return response
}
