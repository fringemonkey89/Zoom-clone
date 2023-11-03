const peerConnections = {};
const config = {
    iceServers: [
        {
        "urls": "stun:stun.l.google.com:19302",
        },
    ]
};

const socket = io.connect(window.location.origin);

socket.on("answer", (id, description) => {
    peerConnections[id].setRemoteDescription(description)
});

socket.on("watcher", id => {
    const peerConnections = new RTCPeerConnection(config)
    peerConnections[id] = peerConnections
});

let stream = videoElement.srcObject;
stream.getTracks().forEach(track => peerConnections.addTrack(track,stream));

peerConnections.onicecandidate = event => {
    if (event.candidate) {
        socket.emit("candidate", id, event.candidate)
    }
}

peerConnections
.createOffer()
.then(sdp => peerConnections.setLocalDescription(sdp))
.then(() => {
    socket.emit("offer", id, peerConnections.locationDescription)
})

socket.on('candidate', (id, candidate) => {
    peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
})