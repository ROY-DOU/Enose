import { Reducer, Effect, Subscription } from 'umi';

const DeviceTable = {
	namespace: 'DeviceList',
	state: {
		name: 'simer',
		data2: [
			{
				key: '1',
				id: '1',
				name: '设备1',
				address: '192.168.0.1',
				status: 'online'
			},
			{
				key: '2',
				id: '2',
				name: '设备2',
				address: '192.168.0.2',
				status: 'online'
			},
			{
				key: '3',
				id: '3',
				name: '设备3',
				address: '192.168.0.3',
				status: 'online'
			},
			{
				key: '4',
				id: '4',
				name: '设备4',
				address: '192.168.0.4',
				status: 'offline'
			}
		]
	},
	reducers: {
		getList(state, action) {
			const data = [
				{
					key: '1',
					id: '1',
					name: '设备1',
					address: '192.168.0.1',
					status: 'online'
				}
			];
			return data;
		}
	},
	effects: {
		*getdata(action, effects) {}
	},
	subscriptions: {
		setup({ dispatch, history }) {
			return history.listen(({ pathname }) => {
				if (pathname === '/users') {
					dispatch({
						type: 'getList'
					});
				}
			});
		}
	}
};
export default DeviceTable;
