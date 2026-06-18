<template>
    <div class="modal-overlay">
        <div class="login-panel">
            <div class="panel-header">
                <div class="panel-badge">Welcome back</div>
                <h2 class="panel-title">登录账号</h2>
                <p class="panel-subtitle">进入聊天室，查看消息并开始对话。</p>
            </div>

            <div class="panel-form">
                <div class="panel-row">
                    <label class="input-label">账号</label>
                    <input class="input-field" v-model="usrname" type="text" placeholder="邮箱 / 手机号 / 账号" />
                </div>

                <div class="panel-row">
                    <label class="input-label">密码</label>
                    <input class="input-field" v-model="password" type="password" placeholder="请输入密码" />
                </div>

                <div :class="['panel-row', 'action-row']">
                    <p :class="['form-tip', feedbackStatus]">
                        {{ feedbackMsg }}
                    </p>
                    <div class="btn-row">
                        <button :class="['btn', 'btn-register']" @click="handler_Register">
                            注册
                        </button>
                        <button :class="['btn', 'btn-login']" @click="handler_Login">
                            登录
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, resolveComponent } from "vue";

const usrname = ref<string>("");
const password = ref<string>("");
import { useUserStore } from "@/stores/user";
import axios from "axios";
import { API_CONFIG } from "@/constants/api";
const userStore = useUserStore();

const emit = defineEmits(["close"]);

const feedbackStatus = ref<string>('');
const feedbackMsg = ref<string>('');

function sleep(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

const handler_Register = async () => {
    if (!usrname.value || !password.value) {
        feedbackMsg.value = "用户名或密码不能为空";
        feedbackStatus.value = "error";
        return;
    }

    const postData = {
        user_name: usrname.value,
        password: password.value
    }

    try {
        const response = await axios.post('/api/register', postData, { timeout: API_CONFIG.TIMEOUT });
        feedbackMsg.value = response.data.message;
        feedbackStatus.value = "success";

        await sleep(500);
        await handler_Login();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            feedbackMsg.value = error.response?.data?.message || "未知错误";
        } else {
            feedbackMsg.value = "未知错误";
        }
        feedbackStatus.value = "error";
    }
};

const handler_Login = async () => {
    if (!usrname.value || !password.value) {
        feedbackMsg.value = "用户名或密码不能为空";
        feedbackStatus.value = "error";
        return;
    }

    const postData = {
        user_name: usrname.value,
        password: password.value
    }

    try {
        const response = await axios.post('/api/login', postData, { timeout: API_CONFIG.TIMEOUT });

        feedbackMsg.value = response.data.message;
        feedbackStatus.value = "success";

        userStore.setUser(usrname.value);

        await sleep(500);
        emit("close");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            feedbackMsg.value = error.response?.data?.message || "未知错误";
        } else {
            feedbackMsg.value = "未知错误";
        }
        feedbackStatus.value = "error";
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
        radial-gradient(circle at top,
            rgba(255, 255, 255, 0.16),
            transparent 38%),
        linear-gradient(160deg, rgba(10, 16, 35, 0.72), rgba(21, 34, 74, 0.82));
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    z-index: 999;
    backdrop-filter: blur(12px);
}

.login-panel {
    width: min(92vw, 420px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 28px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 24px 60px rgba(12, 20, 48, 0.28);
    transform: translateY(0);
    animation: cardEnter 0.35s ease both;
}

@keyframes cardEnter {
    from {
        opacity: 0;
        transform: translateY(14px) scale(0.98);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.panel-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.panel-badge {
    align-self: flex-start;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #4f6ef7;
    background: rgba(79, 110, 247, 0.1);
}

.panel-title {
    margin: 0;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
    color: #172033;
}

.panel-subtitle {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #6b7280;
}

.panel-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.panel-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-label {
    font-size: 13px;
    font-weight: 600;
    color: #3b4459;
}

.input-field {
    width: 100%;
    box-sizing: border-box;
    padding: 13px 14px;
    border: 1px solid #d8deea;
    border-radius: 14px;
    background: rgba(246, 248, 252, 0.95);
    outline: none;
    font-size: 14px;
    color: #172033;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
}

.input-field:focus {
    border-color: #4f6ef7;
    box-shadow: 0 0 0 4px rgba(79, 110, 247, 0.12);
    background: #ffffff;
}

.input-field::placeholder {
    color: #9aa4b2;
}

/* .btn-row {
    flex-direction: row;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 4px;
} */

.btn {
    min-width: 96px;
    padding: 11px 18px;
    border: none;
    border-radius: 14px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.01em;
    transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        opacity 0.18s ease;
}

.btn-register {
    background: rgba(242, 245, 250, 0.95);
    color: #4b5563;
}

.btn-login {
    background: linear-gradient(135deg, #667eea 0%, #5a6cf0 45%, #4f6ef7 100%);
    color: #ffffff;
    box-shadow: 0 10px 22px rgba(79, 110, 247, 0.28);
}

.btn:hover {
    transform: translateY(-1px);
    opacity: 0.96;
}

.btn:active {
    transform: translateY(0);
}

.action-row {
    flex-direction: row;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
}

.form-tip {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 13px;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.form-tip.success {
    color: #22c55e;
}

.form-tip.error {
    color: #ef4444;
}

.btn-row {
    display: flex;
    flex-direction: row;
    gap: 12px;
    flex-shrink: 0;
    padding-top: 0;
}
</style>
