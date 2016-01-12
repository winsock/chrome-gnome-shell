/*
    Gnome-shell integration for Chrome
    Copyright (C) 2016  Yuri Konotopov <ykonotopov@gmail.com>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
 */

GSC.notifications = (function($) {
	function create(name, options) {
		chrome.storage.local.get({
			notifications: {}
		}, function (items) {
			var notifications = items.notifications;

			notifications[name] = $.extend({
				type: chrome.notifications.TemplateType.BASIC,
				iconUrl: 'icons/GnomeLogo-128.png',
				title: 'Gnome-shell integration',
				buttons: [
					{title: 'Close'}
				],
				priority: 2,
				isClickable: true
			}, options);

			_create(name, notifications[name], function (notificationId) {
				chrome.storage.local.set({
					notifications: notifications
				});

				update(notificationId);
			});
		});
	}

	function _create(name, options, callback)
	{
		if (callback)
		{
			chrome.notifications.create(name, options, callback);
		}
		else
		{
			chrome.notifications.create(name, options);
		}
	}

	function update(notificationId) {
		chrome.storage.local.get({
			notifications: {}
		}, function (items) {
			var notifications = items.notifications;

			if (notifications[notificationId])
			{
				_create(notificationId, notifications[notificationId]);
			}
		});
	}

	function remove(notificationId) {
		chrome.storage.local.get({
			notifications: {}
		}, function (items) {
			var notifications = items.notifications;

			if (notifications[notificationId])
			{
				delete notifications[notificationId];
				chrome.storage.local.set({
					notifications: notifications
				});
			}

			chrome.notifications.clear(notificationId);
		});
	}

	return {
		create: create,
		update: update,
		remove: remove
	};
})(jQuery);