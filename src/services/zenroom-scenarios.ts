const scenarios : any = {
    encrypt: function(){
        return `Scenario 'ecdh': Encrypt a message with the password 
        Given that I have a 'string' named 'password' 
        Given that I have a 'string' named 'header' 
        Given that I have a 'string' named 'message' 
        When I encrypt the secret message 'message' with 'password' 
        Then print the 'secret message'`
    },
    decrypt: function(){
        return `Scenario 'ecdh': Decrypt the message with the password 
        Given that I have a valid 'secret message' 
        Given that I have a 'string' named 'password' 
        When I decrypt the text of 'secret message' with 'password' 
        When I rename the 'text' to 'textDecrypted' 
        Then print the 'textDecrypted' as 'string'`
    }
}
export default scenarios;
