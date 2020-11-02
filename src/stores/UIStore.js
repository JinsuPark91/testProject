import { observable, action } from 'mobx';

class UIStore {
  @observable visibleAddFriendsDialog: Boolean = false;

  @observable addFriendsDialogTabKey: string = 'organization';

  @observable visibleRemoveFriendDialog: Boolean = false;

  @observable addFriendByPhoneNumberButtonDisabled: Boolean = true;

  @observable addFriendsDialogInfo: Object = {
    width: 800,
    height: 600,
  };

  @observable visibleSettingDialog: Boolean = false;

  @action.bound
  changeAddFriendsDialogTabKey(tabKey) {
    console.log(this);
    switch (tabKey) {
      case 'phone':
      case 'id':
      case 'organization':
      case 'recommended':
      case 'invitation':
        this.addFriendsDialogTabKey = tabKey;
        break;
      default:
        break;
    }
  }

  /**
   *
   * @param {('organization'|'phone'|'id'|'recommended'|'invitation')} tab - (옵션) 해당 탭 화면으로 Dialog를 띄운다. 없으면 이전 탭을 유지
   */
  @action
  showAddFriendsDialog(tab) {
    this.visibleAddFriendsDialog = true;
    this.changeAddFriendsDialogTabKey(tab);
  }

  @action
  showSettingDialog() {
    console.log('tesdtt');
    this.visibleSettingDialog = true;
  }

  @action
  hideSettingDialog() {
    console.log('tesdtt');
    this.visibleSettingDialog = false;
  }

  @action
  hideAddFriendsDialog() {
    this.visibleAddFriendsDialog = false;
  }

  @action
  setAddFriendByPhoneNumberButtonDisabled(data: Boolean) {
    this.addFriendByPhoneNumberButtonDisabled = data;
  }
}

export default UIStore;
