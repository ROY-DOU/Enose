import { useAccess } from '@umijs/max';
import React from 'react';
import { history } from '@umijs/max';

const UnAuthPage: React.FC = () => {
	const access=useAccess();
	if(!access.isLogin){
		history.push('./login');
	}
	return <>no access</>
}

export default UnAuthPage;