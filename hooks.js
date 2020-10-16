const aws = require('aws-sdk')
const codedeploy = new aws.CodeDeploy({ apiVersion: '2014-10-06' })
const lambda =  new aws.Lambda({ region: 'us-east-1' });
// aws lambda invoke --function-name apollo-lambda-dev-graphql --payload file://request.json --cli-binary-format raw-in-base64-out out.txt
function validation(ms){
  return new Promise(resolve => setTimeout(resolve,ms))
}

function notifyStatus(deploymentId,lifecycleEventHookExecutionId,status ){
  return codedeploy.putLifecycleEventHookExecutionStatus({
    deploymentId,
    lifecycleEventHookExecutionId,
    status // status can be 'Succeeded' or 'Failed'
  }).promise()
}
module.exports.pre = async (event, context) => {
  var deploymentId = event.DeploymentId
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId

  console.log(`DeploymentId ${deploymentId}, lifecycleEventHookExecutionId ${lifecycleEventHookExecutionId}`)

  try{
    console.log(`${new Date().toISOString()}: Starting validation api ...`)
    console.log('Check some stuff before shifting traffic...')
    console.log(process.env.GW_URL)
    console.log(process.env.VAR_A)
    console.log(process.env.function_name)
    //lambda.invoke({FunctionName: 'process.env.function_name',Payload})
    await validation(600)
    console.log(`${new Date().toISOString()}: Ending validation api ...`)
    const codeDeployResults = await notifyStatus(deploymentId, lifecycleEventHookExecutionId, 'Failed');
    console.log(JSON.stringify(codeDeployResults))
    return 'Validation test succeeded'
  }catch (err) {
    console.log('Validation test failed', err)
    return new Error('Validation test failed')
  }
}

module.exports.post = async (event, context) => {

  var deploymentId = event.DeploymentId
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId

  console.log(`DeploymentId ${deploymentId}, lifecycleEventHookExecutionId ${lifecycleEventHookExecutionId}`)

  try{
    console.log(`${new Date().toISOString()}: Starting validation api ...`)
    console.log('Check some stuff after shifting traffic...')
    console.log(process.env.GW_URL)
    console.log(process.env.VAR_A)
    console.log(process.env.function_name)
    await validation(100)
    console.log(`${new Date().toISOString()}: Ending validation api ...`)
    const codeDeployResults = await notifyStatus(deploymentId, lifecycleEventHookExecutionId, 'Succeeded');
    console.log(JSON.stringify(codeDeployResults))
    return 'Validation test succeeded'
  }catch (err) {
    console.log('Validation test failed', err)
    return new Error('Validation test failed')
  }
}
