from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import time
from datetime import date, datetime

myMQTTClient = AWSIoTMQTTClient("new_Client")
myMQTTClient.configureEndpoint("ap6thgx18rs03.iot.us-west-2.amazonaws.com", 8883)
myMQTTClient.configureCredentials("/Users/said_/Desktop/AWS/test/bigTest/CA.pem", "/Users/said_/Desktop/AWS/test/bigTest/baac1e25c3-private.pem.key", "/Users/said_/Desktop/AWS/test/bigTest/baac1e25c3-certificate.pem.crt")
myMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

time.sleep(2) #wait for 2 secs

connecting_time = time.time() + 10

if time.time() < connecting_time:  #try connecting to AWS for 10 seconds
    myMQTTClient.connect()
    myMQTTClient.publish("DHT11/info", "connected", 0)
    print("MQTT Client connection success!")
else:
    print("Error: Check your AWS details in the program")
    
time.sleep(2) #wait for 2 secs

while 1: #Infinite Loop
    now = datetime.utcnow() #get date and time 
    current_time = now.strftime('%Y-%m-%dT%H:%M:%SZ') #get current time in string format 
    
    time.sleep(2) #Wait for 2 sec then update the values

    #prepare the payload in string format 
    payload = '{ "timestamp": "' + current_time + '","temperature": ' + '15' + ',"humidity": '+ '85' + ' }'

    print(payload) #print payload for reference 
    myMQTTClient.publish("DHT11/data", payload, 0) #publish the payload
    
    time.sleep(2) #Wait for 2 sec then update the values
