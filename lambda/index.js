const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    console.log('Raw input data:', event); // Add this line to log the raw input data

    if ( event.formtype == "contact") {
      var formData = {
        formtype: event.formtype,
        name: event.name,
        email: event.email,
        subject: event.subject,
        message: event.message
      };
    } else if ( event.formtype == "preregistration") {
      var formData = {
        formtype: event.formtype,
        name: event.name,
        email: event.email,
        mobile: event.mobile,
        genre: event.genre,
        url: event.url,
        message: event.message
      };
    }  else if ( event.formtype == "subscribe") {
      var formData = {
        formtype: event.formtype,
        name: event.name,
        email: event.email
      };
    }
  
    const item = {
      SubmissionId: generateUUID(), // Generate a UUID
      ...formData, // Use the form data as attributes
    };

    // Store the form data in DynamoDB
    await storeFormData(item);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error submitting the form' }),
    };
  }
};

function storeFormData(item) {
  const params = {
    TableName: 'ContactFormEntries',
    Item: item,
  };

  return dynamodb.put(params).promise();
}

function generateUUID() {
  return uuidv4();
}
