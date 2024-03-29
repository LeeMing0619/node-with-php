var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var FileList = require('./FileList');
var AddFiles = require('./AddFiles');
var AddFilesPanel = require('./AddFilesPanel');
var PickerPanelContent = require('./PickerPanelContent');
var PanelTopBar = require('./PickerPanelTopBar');
var FileCard = require('./FileCard');
var classNames = require('classnames');
var isTouchDevice = require('@uppy/utils/lib/isTouchDevice');

var _require = require('preact'),
    h = _require.h;

var PreactCSSTransitionGroup = require('preact-css-transition-group');

// http://dev.edenspiekermann.com/2016/02/11/introducing-accessible-modal-dialog
// https://github.com/ghosh/micromodal

function TransitionWrapper(props) {
  return h(
    PreactCSSTransitionGroup,
    {
      transitionName: 'uppy-transition-slideDownUp',
      transitionEnterTimeout: 250,
      transitionLeaveTimeout: 250 },
    props.children
  );
}

module.exports = function Dashboard(props) {
  var noFiles = props.totalFileCount === 0;

  var dashboardClassName = classNames({ 'uppy-Root': props.isTargetDOMEl }, 'uppy-Dashboard', { 'Uppy--isTouchDevice': isTouchDevice() }, { 'uppy-Dashboard--animateOpenClose': props.animateOpenClose }, { 'uppy-Dashboard--isClosing': props.isClosing }, { 'uppy-Dashboard--isDraggingOver': props.isDraggingOver }, { 'uppy-Dashboard--modal': !props.inline }, { 'uppy-size--md': props.containerWidth > 576 }, { 'uppy-size--lg': props.containerWidth > 700 }, { 'uppy-size--xl': props.containerWidth > 900 }, { 'uppy-Dashboard--isAddFilesPanelVisible': props.showAddFilesPanel }, { 'uppy-Dashboard--isInnerWrapVisible': props.areInsidesReadyToBeVisible });

  return h(
    'div',
    { 'class': dashboardClassName,
      'aria-hidden': props.inline ? 'false' : props.isHidden,
      'aria-label': !props.inline ? props.i18n('dashboardWindowTitle') : props.i18n('dashboardTitle'),
      onpaste: props.handlePaste,

      onDragOver: props.handleDragOver,
      onDragLeave: props.handleDragLeave,
      onDrop: props.handleDrop
    },
    h('div', { 'class': 'uppy-Dashboard-overlay', tabindex: -1, onclick: props.handleClickOutside }),
    h(
      'div',
      { 'class': 'uppy-Dashboard-inner',
        'aria-modal': !props.inline && 'true',
        role: !props.inline && 'dialog',
        style: {
          width: props.inline && props.width ? props.width : '',
          height: props.inline && props.height ? props.height : ''
        } },
      !props.inline ? h(
        'button',
        { 'class': 'uppy-u-reset uppy-Dashboard-close',
          type: 'button',
          'aria-label': props.i18n('closeModal'),
          title: props.i18n('closeModal'),
          onclick: props.closeModal },
        h(
          'span',
          { 'aria-hidden': 'true' },
          '\xD7'
        )
      ) : null,
      h(
        'div',
        { 'class': 'uppy-Dashboard-innerWrap' },
        h(
          'div',
          { 'class': 'uppy-Dashboard-dropFilesHereHint' },
          props.i18n('dropHint')
        ),
        !noFiles && props.showSelectedFiles && h(PanelTopBar, props),
        props.showSelectedFiles ? noFiles ? h(AddFiles, props) : h(FileList, props) : h(AddFiles, props),
        h(
          TransitionWrapper,
          null,
          props.showAddFilesPanel ? h(AddFilesPanel, _extends({ key: 'AddFilesPanel' }, props)) : null
        ),
        h(
          TransitionWrapper,
          null,
          props.fileCardFor ? h(FileCard, _extends({ key: 'FileCard' }, props)) : null
        ),
        h(
          TransitionWrapper,
          null,
          props.activePickerPanel ? h(PickerPanelContent, _extends({ key: 'PickerPanelContent' }, props)) : null
        ),
        h(
          'div',
          { 'class': 'uppy-Dashboard-progressindicators' },
          props.progressindicators.map(function (target) {
            return props.getPlugin(target.id).render(props.state);
          })
        )
      )
    )
  );
};