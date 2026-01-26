import { BackUrlForDoc } from 'constants/global';
import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.room = null;
        this.isConnecting = false;
        this.listeners = new Map();
    }

    connect(url = BackUrlForDoc) {
        if (this.socket?.connected) {
            return;
        }

        this.isConnecting = true;

        this.socket = io(url, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true
        });

        // this.socket = io('https://admin.gennis.uz', {
        //     path: '/socket.io/',
        //     transports: ['websocket', 'polling'],
        //     upgrade: true,
        //     // reconnection: true,
        //     reconnectionAttempts: 5,
        //     reconnectionDelay: 1000,
        //     timeout: 20000,
        //     autoConnect: true,
        //     // Add these for stability
        //     forceNew: false,
        //     multiplex: true
        // });

        this.socket.on('connect', () => {
            this.isConnecting = false
        });

        this.socket.on('connection_response', (data) => {
        });

        this.socket.on('disconnect', () => {
            console.log("Disconnect");

            this.isConnecting = false
            this.room = null
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}`);

            // Если были проблемы с WebSocket - используем только polling
            if (this.hasWebSocketError && this.socket && this.socket.io) {
                console.log('💡 Using polling for reconnection');
                this.socket.io.opts.transports = ['polling'];
                this.socket.io.opts.upgrade = false;
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`✅ Reconnected after ${attemptNumber} attempts`);
            console.log('   Transport:', this.socket.io.engine.transport.name);
            this.room = null
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔴 Connection error:', error.message);
            this.isConnecting = false;
            this.room = null;
        });

        this.socket.on('connect_error', (error) => {
            this.isConnecting = false
        });

        this.socket.on('join_response', (data) => {
        });

        // ✅ ИСПРАВЛЕНО: правильное событие
        this.socket.on('join_call_response', (data) => {
        });
    }

    joinUserRoom(userId) {
        if (!this.socket) {
            return;
        }
        console.log(this.room, "this.room");
        console.log(userId, "userId");

        if (this.room === userId) {
            return
        } else {
            this.room = userId
            this.socket.emit('join', { user_id: userId });
        }
    }

    leaveUserRoom(userId) {
        if (!this.socket) return;
        this.socket.emit('leave', { user_id: userId });
    }

    joinCallRoom(callId) {
        if (!this.socket) {
            return;
        }
        // ✅ ИСПРАВЛЕНО: используем join_call вместо join
        this.socket.emit('join_call', { call_id: callId });
    }

    leaveCallRoom(callId) {
        if (!this.socket) return;
        this.socket.emit('leave_call', { call_id: callId });
    }

    // ✅ ИСПРАВЛЕНО: убраны скобки у callback
    onCallStatus(callback) {
        if (!this.socket) {
            return;
        }
        this.socket.on('call_status', callback);
        this.listeners.set('call_status', callback);
    }

    offCallStatus() {
        if (!this.socket) return;

        const callback = this.listeners.get('call_status');
        if (callback) {
            this.socket.off('call_status', callback);
            this.listeners.delete('call_status');
        }
    }

    on(event, callback) {
        if (!this.socket) {
            return;
        }
        this.socket.on(event, callback);
        this.listeners.set(event, callback);
    }

    off(event) {
        if (!this.socket) return;

        const callback = this.listeners.get(event);
        if (callback) {
            this.socket.off(event, callback);
            this.listeners.delete(event);
        }
    }

    emit(event, data) {
        if (!this.socket) {
            return;
        }
        this.socket.emit(event, data);
    }

    disconnect() {
        if (this.socket) {
            this.isConnecting = false
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    isConnected() {
        return this.isConnecting || this.socket?.connected || false
    }

    getSocket() {
        return this.socket;
    }
}

export default new SocketService();