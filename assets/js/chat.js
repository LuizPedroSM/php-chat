let chat = {
    groups: [],
    activeGroup: 0,
    lastTime: '',
    msgRequest: null,
    userRequest: null,
    setGroup: function (id, name) {
        let found = false;

        for (const i in this.groups) {
            if (this.groups[i].id == id) {
                found = true;
            }
        }

        if (found == false) {
            this.groups.push({
                id: id,
                name: name,
                messages: [],
                users: []
            });
        }

        if (this.groups.length == 1) {
            this.setActiveGroup(id);
        }

        this.updateGroupView();

        if (this.msgRequest != null) {
            this.msgRequest.abort();
        }
    },
    removeGroup: function (id) {
        for (const i in this.groups) {
            if (this.groups[i].id == id) {
                this.groups.splice(i, 1);
            }
        }

        if (this.activeGroup == id) {
            if (this.groups.length > 0) {
                this.setActiveGroup(this.groups[0].id);
            } else {
                this.activeGroup = 0;
            }
        }

        this.updateGroupView();

        if (this.msgRequest != null) {
            this.msgRequest.abort();
        }
    },
    getGroups: function () {
        return this.groups;
    },
    loadGroupList: function (ajaxCallback) {
        $.ajax({
            url: BASE + 'ajax/get_groups',
            type: 'GET',
            dataType: 'json',
            success: function (json) {
                if (json.status == '1') {
                    ajaxCallback(json);
                } else {
                    window.location.href = BASE + 'login';
                }
            }
        });
    },
    addNewGroup: function (groupName, ajaxCallback) {
        $.ajax({
            url: BASE + 'ajax/add_group',
            type: 'POST',
            data: { name: groupName },
            dataType: 'json',
            success: function (json) {
                if (json.status == '1') {
                    ajaxCallback(json);
                } else {
                    window.location.href = BASE + 'login';
                }
            }
        });
    },
    updateGroupView: function () {
        let html = '';

        for (const i in this.groups) {
            html += '<li data-id="' + this.groups[i].id + '">'
            html += '<div class="group_close"> X </div>'
            html += '<div class="group_name"> ' + this.groups[i].name + ' </div>'
            html += '</li>';
        }

        $('nav ul').html(html);
        this.loadConversation();
    },
    setActiveGroup: function (id) {
        this.activeGroup = id;
        this.loadConversation();
    },
    getActiveGroup: function () {
        return this.activeGroup;
    },
    loadConversation: function () {
        if (this.activeGroup != 0) {
            $('nav ul').find('.active_group').removeClass('active_group');
            $('nav ul').find('li[data-id=' + this.activeGroup + ']').addClass('active_group');
        }

        this.showMessages();
        this.showUserList();
    },
    showUserList: function () {
        if (this.activeGroup != 0) {
            let users = [];

            for (const i in this.groups) {
                if (this.groups[i].id == this.activeGroup) {
                    users = this.groups[i].users;
                }
            }

            let html = '';
            for (const i in users) {
                html += '<li>' + users[i] + '</li>';
            }

            $('.user_list ul').html(html);
        } else {
            $('.user_list ul').html('');

        }
    },
    showMessages: function () {
        $('.messages').html('');

        if (this.activeGroup != 0) {
            var msgs = [];

            for (const i in this.groups) {
                if (this.groups[i].id == this.activeGroup) {
                    msgs = this.groups[i].messages;
                }
            }

            for (const i in msgs) {
                let html = '<div class="message">';
                html += '<div class="m_info">';
                html += '<span class="m_sender">' + msgs[i].sender_name + '</span>';
                html += '<span class="m_date">' + msgs[i].sender_date + '</span>';
                html += '</div >';
                html += '<div class="m_body">';
                if (msgs[i].msg_type == 'text') {
                    html += msgs[i].msg;
                } else if (msgs[i].msg_type == 'img') {
                    html += '<img src="' + BASE + 'media/images/' + msgs[i].msg + '" />';
                }

                html += '</div>';
                html += '</div >';

                $('.messages').append(html);
            }
        }
    },
    sendMessage: function (msg) {
        if (msg.length > 0 && this.activeGroup != 0) {
            $.ajax({
                url: BASE + 'ajax/add_message',
                type: 'POST',
                data: { id_group: this.activeGroup, msg: msg },
                dataType: 'json',
                success: function (json) {
                    if (json.status == '1') {
                        if (json.error == '1') {
                            alert(json.errorMsg);
                        }
                    } else {
                        window.location.href = BASE + 'login';
                    }
                }
            });
        }
    },
    sendPhoto: function (img) {
        if (this.activeGroup != 0) {
            let formData = new FormData();
            formData.append('img', img);
            formData.append('id_group', this.activeGroup);

            $.ajax({
                url: BASE + 'ajax/add_photo',
                type: 'POST',
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (json) {
                    if (json.status == '1') {
                        if (json.error == '1') {
                            alert(json.errorMsg);
                        }
                    } else {
                        window.location.href = BASE + 'login';
                    }
                },
                xhr: function () {

                    let xhrDefault = $.ajaxSettings.xhr();

                    if (xhrDefault.upload) {
                        xhrDefault.upload.addEventListener('progress', function (p) {
                            let total = p.total;
                            let loaded = p.loaded;
                            let pct = (total / loaded) * 100;

                            if (pct > 0) {
                                $('.progressbar').css('width', pct + '%');
                                $('.progress').show();
                            }

                            if (pct > 100) {
                                $('.progressbar').css('width', '0%');
                                $('.progress').hide();
                            }

                        }, false);
                    }
                    return xhrDefault;
                }
            });
        }
    },
    updateLastTime: function (last_time) {
        this.lastTime = last_time;
    },
    updateUserList: function (list, id_group) {
        for (const i in this.groups) {
            if (this.groups[i].id == id_group) {
                this.groups[i].users = list;
            }
        }
    },
    insertMessage: function (item) {
        for (const i in this.groups) {
            if (this.groups[i].id == item.id_group) {
                let date_msg = item.date_msg.split(' ');
                date_msg = date_msg[1];

                this.groups[i].messages.push({
                    id: item.id,
                    sender_id: item.id_user,
                    sender_name: item.username,
                    sender_date: date_msg,
                    msg: item.msg,
                    msg_type: item.msg_type
                });
            }
        }
    },
    chatActivity: function () {
        let gs = this.getGroups();
        var groups = [];

        for (const i in gs) {
            groups.push(gs[i].id);
        }

        if (groups.length > 0) {
            this.msgRequest = $.ajax({
                url: BASE + 'ajax/get_messages',
                type: 'GET',
                data: { last_time: this.lastTime, groups: groups },
                dataType: 'json',
                success: function (json) {
                    if (json.status == '1') {
                        chat.updateLastTime(json.lastTime);

                        for (const i in json.msgs) {
                            chat.insertMessage(json.msgs[i]);
                        }
                        chat.showMessages();

                    } else {
                        window.location.href = BASE + 'login';
                    }
                },
                complete: function () {
                    chat.chatActivity();
                }
            });
        } else {
            setTimeout(() => {
                chat.chatActivity();
            }, 5000);
        }
    },
    userListActivity: function () {
        let gs = this.getGroups();
        var groups = [];

        for (const i in gs) {
            groups.push(gs[i].id);
        }
        if (groups.length > 0) {
            this.userRequest = $.ajax({
                url: BASE + 'ajax/get_userlist',
                type: 'GET',
                data: { groups: groups },
                dataType: 'json',
                success: function (json) {
                    if (json.status == '1') {

                        for (const i in json.users) {
                            chat.updateUserList(json.users[i], i);
                        }
                        chat.showUserList();

                    } else {
                        window.location.href = BASE + 'login';
                    }
                },
                complete: function () {
                    setTimeout(() => {
                        chat.userListActivity();
                    }, 5000);
                }
            });
        } else {
            setTimeout(() => {
                chat.userListActivity();
            }, 1000);
        }
    }
}
