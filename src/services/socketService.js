import { BackUrlForDoc } from 'constants/global';
import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect(url = BackUrlForDoc) {
        if (this.socket?.connected) {
            console.log('Already connected');
            return;
        }

        this.socket = io(url, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            autoConnect: true
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected:', this.socket.id);
        });

        this.socket.on('connection_response', (data) => {
            console.log('📡 Connection response:', data);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Socket disconnected');
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔴 Connection error:', error);
        });

        this.socket.on('join_response', (data) => {
            console.log('👤 Joined user room:', data);
        });

        // ✅ ИСПРАВЛЕНО: правильное событие
        this.socket.on('join_call_response', (data) => {
            console.log('📞 Joined call room:', data);
        });
    }

    joinUserRoom(userId) {
        if (!this.socket) {
            console.error('Socket not connected');
            return;
        }
        console.log(`🚪 Joining room for user_${userId}`);
        this.socket.emit('join', { user_id: userId });
    }

    leaveUserRoom(userId) {
        if (!this.socket) return;
        this.socket.emit('leave', { user_id: userId });
    }

    joinCallRoom(callId) {
        if (!this.socket) {
            console.error('Socket not connected');
            return;
        }
        console.log(`🚪 Joining room for call: ${callId}`);
        // ✅ ИСПРАВЛЕНО: используем join_call вместо join
        this.socket.emit('join_call', { call_id: callId });
    }

    leaveCallRoom(callId) {
        if (!this.socket) return;
        console.log(`👋 Leaving room for call: ${callId}`);
        this.socket.emit('leave_call', { call_id: callId });
    }

    // ✅ ИСПРАВЛЕНО: убраны скобки у callback
    onCallStatus(callback) {
        if (!this.socket) {
            console.error('Socket not connected');
            return;
        }
        console.log('📝 Registering call_status listener');  // ← БЕЗ вызова!
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
            console.error('Socket not connected');
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
            console.error('Socket not connected');
            return;
        }
        this.socket.emit(event, data);
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
        }
    }

    isConnected() {
        return this.socket?.connected || false;
    }

    getSocket() {
        return this.socket;
    }
}

export default new SocketService();