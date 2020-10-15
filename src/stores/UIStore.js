import { observable, action } from 'mobx';

class UIStore {
  @observable visibleAddFriendsDialog: Boolean = false;

  @observable visibleRemoveFriendDialog: Boolean = false;

  @observable addFriendByPhoneNumberButtonDisabled: Boolean = true;

  @observable addFriendsDialogInfo: Object = {
    width: 800,
    height: 600,
  };

  @observable visibleSettingDialog: Boolean = false;

  @action
  showAddFriendsDialog() {
    this.visibleAddFriendsDialog = true;
  }
  @action
  showSettingDialog() {
    console.log("tesdtt")
    this.visibleSettingDialog = true;
  }
  @action
  hideSettingDialog() {
    console.log("tesdtt")
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
