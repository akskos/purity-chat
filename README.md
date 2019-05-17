# purity-chat
stupidhack project


## Message formats

### Requesting room info:
{  
	"type": "info"  
}

### Receiving room info:
{  
	"type": "info",  
	"users": [String],  
	"messages":   
	[{  
		"sender": String,  
		"text": String  
	}]  
}

### Sending a message:
{  
	"type": "msg",  
	"text": String  
}

### Receiving a message:
{  
	"type": "msg",  
	"sender": String,  
	"text": String  
}

### Receiving user connect and disconnect messages:
{  
	"type": "userConnected"/"userDisconnected"  
	"userName": String  
}