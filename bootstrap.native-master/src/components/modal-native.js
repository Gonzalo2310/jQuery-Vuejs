
/* Native JavaScript for Bootstrap 4 | Modal
-------------------------------------------- */
import { hasClass } from 'shorter-js/src/class/hasClass.js';
import { addClass } from 'shorter-js/src/class/addClass.js';
import { removeClass } from 'shorter-js/src/class/removeClass.js';
import { on } from 'shorter-js/src/event/on.js';
import { off } from 'shorter-js/src/event/off.js';
import { passiveHandler } from 'shorter-js/src/misc/passiveHandler.js';
import { emulateTransitionEnd } from 'shorter-js/src/misc/emulateTransitionEnd.js';
import { getElementTransitionDuration } from 'shorter-js/src/misc/getElementTransitionDuration.js';
import { queryElement } from 'shorter-js/src/misc/queryElement.js';

import { bootstrapCustomEvent, dispatchCustomEvent } from '../util/event.js';
import { setFocus } from '../util/misc.js';

// MODAL DEFINITION
// ================

export default function Modal(element,options) { // element can be the modal/triggering button

  // set options
  options = options || {};

  // bind, modal
  let self = this, modal,

    // custom events
    showCustomEvent,
    shownCustomEvent,
    hideCustomEvent,
    hiddenCustomEvent,
    // event targets and other
    relatedTarget = null,
    scrollBarWidth,
    overlay,
    overlayDelay,

    // also find fixed-top / fixed-bottom items
    fixedItems,
    ops = {};

  // private methods
  function setScrollbar() {
    let openModal = hasClass(document.body,'modal-open'),
        bodyPad = parseInt(getComputedStyle(document.body).paddingRight),
        bodyOverflow = document.documentElement.clientHeight !== document.documentElement.scrollHeight 
                    || document.body.clientHeight !== document.body.scrollHeight,
        modalOverflow = modal.clientHeight !== modal.scrollHeight;

    scrollBarWidth = measureScrollbar();

    modal.style.paddingRight = !modalOverflow && scrollBarWidth ? `${scrollBarWidth}px` : '';
    document.body.style.paddingRight = modalOverflow || bodyOverflow ? `${bodyPad + (openModal ? 0:scrollBarWidth)}px` : '';

    fixedItems.length && fixedItems.map(fixed=>{
      let itemPad = getComputedStyle(fixed).paddingRight;
      fixed.style.paddingRight = modalOverflow || bodyOverflow ? `${parseInt(itemPad) + (openModal?0:scrollBarWidth)}px` : `${parseInt(itemPad)}px`;
    })
  }
  function resetScrollbar() {
    document.body.style.paddingRight = '';
    modal.style.paddingRight = '';
    fixedItems.length && fixedItems.map(fixed=>{
      fixed.style.paddingRight = '';
    })
  }
  function measureScrollbar() {
    let scrollDiv = document.createElement('div'), widthValue;

    scrollDiv.className = 'modal-scrollbar-measure'; // this is here to stay
    document.body.appendChild(scrollDiv);
    widthValue = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return widthValue;
  }
  function checkScrollbar() {
    
  }
  function createOverlay() {
    let newOverlay = document.createElement('div');
    overlay = queryElement('.modal-backdrop');

    if ( overlay === null ) {
      newOverlay.setAttribute('class', 'modal-backdrop' + (ops.animation ? ' fade' : ''));
      overlay = newOverlay;
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  function removeOverlay () {
    overlay = queryElement('.modal-backdrop');
    if ( overlay && !document.getElementsByClassName('modal show')[0] ) {
      document.body.removeChild(overlay); overlay = null;       
    }
    overlay === null && (removeClass(document.body,'modal-open'), resetScrollbar());
  }
  function toggleEvents(action) {
    action(window, 'resize', self.update, passiveHandler);
    action(modal, 'click', dismissHandler);
    action(document, 'keydown', keyHandler);
  }
  // triggers
  function beforeShow() {
    modal.style.display = 'block'; 

    setScrollbar();
    !document.getElementsByClassName('modal show')[0] && addClass(document.body,'modal-open');

    addClass(modal,'show');
    modal.setAttribute('aria-hidden', false);

    hasClass(modal,'fade') ? emulateTransitionEnd(modal, triggerShow) : triggerShow();
  }
  function triggerShow() {
    setFocus(modal);
    modal.isAnimating = false;

    toggleEvents(on);

    shownCustomEvent = bootstrapCustomEvent('shown', 'modal', relatedTarget);
    dispatchCustomEvent.call(modal, shownCustomEvent);
  }
  function triggerHide(force) {
    modal.style.display = '';
    element && (setFocus(element));

    overlay = queryElement('.modal-backdrop');

    // force can also be the transitionEvent object, we wanna make sure it's not
    if (force !== 1 && overlay && hasClass(overlay,'show') && !document.getElementsByClassName('modal show')[0]) {
      removeClass(overlay,'show');
      emulateTransitionEnd(overlay,removeOverlay);
    } else {
      removeOverlay();
    }

    toggleEvents(off);

    modal.isAnimating = false;

    hiddenCustomEvent = bootstrapCustomEvent('hidden', 'modal');
    dispatchCustomEvent.call(modal, hiddenCustomEvent);
  }
  // handlers
  function clickHandler(e) {
    if ( modal.isAnimating ) return;
    let clickTarget = e.target,
        modalID = `#${modal.getAttribute('id')}`,
        targetAttrValue = clickTarget.getAttribute('data-target') || clickTarget.getAttribute('href'),
        elemAttrValue = element.getAttribute('data-target') || element.getAttribute('href');

    if ( !hasClass(modal,'show') 
        && (clickTarget === element && targetAttrValue === modalID 
        || element.contains(clickTarget) && elemAttrValue === modalID) ) {
      modal.modalTrigger = element;
      relatedTarget = element;
      self.show();
      e.preventDefault();
    }
  }
  function keyHandler({which}) {
    if (!modal.isAnimating && ops.keyboard && which == 27 && hasClass(modal,'show') ) {
      self.hide();
    }
  }
  function dismissHandler(e) {
    if ( modal.isAnimating ) return;
    let clickTarget = e.target,
        hasData = clickTarget.getAttribute('data-dismiss') === 'modal',
        parentWithData = clickTarget.closest('[data-dismiss="modal"]');

    if ( hasClass(modal,'show') && ( parentWithData || hasData
        || clickTarget === modal && ops.backdrop !== 'static' ) ) {
      self.hide(); relatedTarget = null;
      e.preventDefault();
    }
  }

  // public methods
  self.toggle = () => {
    if ( hasClass(modal,'show') ) {self.hide();} else {self.show();}
  };
  self.show = () => {
    if (hasClass(modal, 'show') && !!modal.isAnimating ) {return}

    showCustomEvent = bootstrapCustomEvent('show', 'modal', relatedTarget);
    dispatchCustomEvent.call(modal, showCustomEvent);

    if ( showCustomEvent.defaultPrevented ) return;

    modal.isAnimating = true;

    // we elegantly hide any opened modal
    let currentOpen = document.getElementsByClassName('modal show')[0];
    if (currentOpen && currentOpen !== modal) {
      currentOpen.modalTrigger && currentOpen.modalTrigger.Modal.hide();
      currentOpen.Modal && currentOpen.Modal.hide();
    }

    if ( ops.backdrop ) {
      overlay = createOverlay();
    }

    if ( overlay && !currentOpen && !hasClass(overlay,'show') ) {
      overlay.offsetWidth; // force reflow to enable trasition
      overlayDelay = getElementTransitionDuration(overlay);
      addClass(overlay, 'show');
    }

    !currentOpen ? setTimeout( beforeShow, overlay && overlayDelay ? overlayDelay:0 ) : beforeShow();
  };
  self.hide = (force) => {
    if ( !hasClass(modal,'show') ) {return}

    hideCustomEvent = bootstrapCustomEvent( 'hide', 'modal');
    dispatchCustomEvent.call(modal, hideCustomEvent);
    if ( hideCustomEvent.defaultPrevented ) return;

    modal.isAnimating = true;    

    removeClass(modal,'show');
    modal.setAttribute('aria-hidden', true);

    hasClass(modal,'fade') && force !== 1 ? emulateTransitionEnd(modal, triggerHide) : triggerHide();
  };
  self.setContent = content => {
    queryElement('.modal-content',modal).innerHTML = content;
  };
  self.update = () => {
    if (hasClass(modal,'show')) {
      setScrollbar();
    }
  };
  self.dispose = () => {
    self.hide(1);
    if (element) {off(element, 'click', clickHandler); delete element.Modal; } 
    else {delete modal.Modal;}
  };

  // init

  // the modal (both JavaScript / DATA API init) / triggering button element (DATA API)
  element = queryElement(element);

  // determine modal, triggering element
  let checkModal = queryElement( element.getAttribute('data-target') || element.getAttribute('href') )
  modal = hasClass(element,'modal') ? element : checkModal

  // set fixed items
  fixedItems = Array.from(document.getElementsByClassName('fixed-top'))
                    .concat(Array.from(document.getElementsByClassName('fixed-bottom')));

  if ( hasClass(element, 'modal') ) { element = null; } // modal is now independent of it's triggering element

  // reset on re-init
  element && element.Modal && element.Modal.dispose();
  modal && modal.Modal && modal.Modal.dispose();

  // set options
  ops.keyboard = options.keyboard === false || modal.getAttribute('data-keyboard') === 'false' ? false : true;
  ops.backdrop = options.backdrop === 'static' || modal.getAttribute('data-backdrop') === 'static' ? 'static' : true;
  ops.backdrop = options.backdrop === false || modal.getAttribute('data-backdrop') === 'false' ? false : ops.backdrop;
  ops.animation = hasClass(modal, 'fade') ? true : false;
  ops.content = options.content; // JavaScript only
  
  // set an initial state of the modal
  modal.isAnimating = false;

  // prevent adding event handlers over and over
  // modal is independent of a triggering element
  if ( element && !element.Modal ) {
    on(element, 'click', clickHandler);
  }

  if ( ops.content ) { 
    self.setContent( ops.content.trim() ); 
  }

  // set associations
  if (element) { 
    modal.modalTrigger = element;
    element.Modal = self;
  } else { 
    modal.Modal = self;
  }

}

