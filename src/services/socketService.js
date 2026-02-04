// services/socketService.js

import { BackUrlForDoc } from 'constants/global';
import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.room = null;
        this.isConnecting = false;
        this.listeners = new Map();
        this.activeCallId = null;
    }

    connect(url = BackUrlForDoc) {
        if (this.socket?.connected) {
            console.log('✅ Socket already connected');
            return;
        }

        // ✅ Отключаем старый сокет перед новым подключением
        if (this.socket) {
            console.log('🔄 Cleaning up old socket');
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
        }

        this.isConnecting = true;

        this.socket = io('https://admin.gennis.uz', {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            upgrade: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            autoConnect: true,
            forceNew: false,
            multiplex: true
        });

        this.socket.on('connect', () => {
            console.log('✅ Socket connected');
            this.isConnecting = false;
        });

        this.socket.on('connection_response', (data) => {
            console.log('📡 Connection response:', data);
        });

        this.socket.on('disconnect', () => {
            console.log('🔴 Socket disconnected');
            this.isConnecting = false;
            this.room = null;
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`🔄 Reconnection attempt ${attemptNumber}`);

            if (this.hasWebSocketError && this.socket && this.socket.io) {
                console.log('💡 Using polling for reconnection');
                this.socket.io.opts.transports = ['polling'];
                this.socket.io.opts.upgrade = false;
            }
        });

        this.socket.on('reconnect', (attemptNumber) => {
            console.log(`✅ Reconnected after ${attemptNumber} attempts`);
            if (this.socket?.io?.engine?.transport) {
                console.log('   Transport:', this.socket.io.engine.transport.name);
            }
            this.room = null;
        });

        this.socket.on('connect_error', (error) => {
            console.error('🔴 Connection error:', error.message);
            this.isConnecting = false;
            this.room = null;
        });

        this.socket.on('join_response', (data) => {
            console.log('✅ Join response:', data);
        });

        this.socket.on('join_call_response', (data) => {
            console.log('✅ Join call response:', data);
        });
    }

    joinUserRoom(userId) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected, cannot join room');
            return;
        }

        // ✅ Выходим из старой комнаты перед входом в новую
        if (this.room && this.room !== userId) {
            console.log(`🚪 Leaving previous room: ${this.room}`);
            this.socket.emit('leave', { user_id: this.room });
        }

        if (this.room === userId) {
            console.log(`✅ Already in room: ${userId}`);
            return;
        }

        console.log(`🚪 Joining room: ${userId}`);
        this.room = userId;
        this.socket.emit('join', { user_id: userId });
    }

    leaveUserRoom(userId) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected');
            return;
        }
        console.log(`🚪 Leaving room: ${userId}`);
        this.socket.emit('leave', { user_id: userId });
        if (this.room === userId) {
            this.room = null;
        }
    }

    joinCallRoom(callId) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected');
            return;
        }
        console.log(`📞 Joining call room: ${callId}`);
        this.socket.emit('join_call', { call_id: callId });
        this.activeCallId = callId;
    }

    leaveCallRoom(callId) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected');
            return;
        }
        console.log(`📞 Leaving call room: ${callId}`);
        this.socket.emit('leave_call', { call_id: callId });
        if (this.activeCallId === callId) {
            this.activeCallId = null;
        }
    }

    // ✅ ГЛАВНАЯ ФУНКЦИЯ - onCallStatus
    onCallStatus(callback) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected, cannot listen to call_status');
            return;
        }

        console.log('👂 Listening to call_status events');

        // Удаляем старый listener если есть
        const oldCallback = this.listeners.get('call_status');
        if (oldCallback) {
            this.socket.off('call_status', oldCallback);
        }

        // Добавляем новый listener
        this.socket.on('call_status', callback);
        this.listeners.set('call_status', callback);
    }

    offCallStatus() {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected');
            return;
        }

        const callback = this.listeners.get('call_status');
        if (callback) {
            console.log('🔇 Removing call_status listener');
            this.socket.off('call_status', callback);
            this.listeners.delete('call_status');
        }
    }

    on(event, callback) {
        if (!this.socket) {
            console.warn(`⚠️ Socket not connected, cannot listen to ${event}`);
            return;
        }

        console.log(`👂 Listening to ${event} events`);

        // Удаляем старый listener если есть
        const oldCallback = this.listeners.get(event);
        if (oldCallback) {
            this.socket.off(event, oldCallback);
        }

        this.socket.on(event, callback);
        this.listeners.set(event, callback);
    }

    off(event) {
        if (!this.socket) {
            console.warn('⚠️ Socket not connected');
            return;
        }

        const callback = this.listeners.get(event);
        if (callback) {
            console.log(`🔇 Removing ${event} listener`);
            this.socket.off(event, callback);
            this.listeners.delete(event);
        }
    }

    emit(event, data) {
        if (!this.socket) {
            console.warn(`⚠️ Socket not connected, cannot emit ${event}`);
            return;
        }
        console.log(`📤 Emitting ${event}:`, data);
        this.socket.emit(event, data);
    }

    disconnect() {
        if (this.socket) {
            console.log('🔌 Disconnecting socket');
            this.isConnecting = false;

            // Выходим из комнаты перед отключением
            if (this.room) {
                this.socket.emit('leave', { user_id: this.room });
                this.room = null;
            }

            // Удаляем все listeners
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
            this.listeners.clear();
            this.activeCallId = null;
        }
    }

    isConnected() {
        return this.socket?.connected || false;
    }

    getSocket() {
        return this.socket;
    }
}

// ✅ ВАЖНО: Экспортируем как default
export default new SocketService();