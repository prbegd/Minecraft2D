(function (_Scratch) {
    'use strict';

    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': '有用积木'
        },
        en: {
            'extensionName': 'UsefulBlocks'
        }
    });

    class UsefulBlocks {
        constructor(_runtime) {
            /**
             * Store this for later communication with the Scratch VM runtime.
             * If this extension is running in a sandbox then 'runtime' is an async proxy object.
             * @type {Runtime}
             */
            this._runtime = _runtime;
        }

        /**
         * @return {object} This extension's metadata.
         */
        getInfo() {

            // const reportBlock = {
            //     /* Required: the machine-readable name of this operation.
            //        This will appear in project JSON. */
            //     opcode: 'getLetterByIndexFromText', // becomes 'someBlocks.myReporter'
            //
            //     /* Required: the kind of block we're defining, from a predefined list.
            //        Fully supported block types:
            //          BlockType.BOOLEAN - same as REPORTER but returns a Boolean value
            //          BlockType.COMMAND - a normal command block, like "move {} steps"
            //          BlockType.HAT - starts a stack if its value changes from falsy to truthy ("edge triggered")
            //          BlockType.REPORTER - returns a value, like "direction"
            //        Block types in development or for internal use only:
            //          BlockType.BUTTON - place a button in the block palette
            //          BlockType.CONDITIONAL - control flow, like "if {}" or "if {} else {}"
            //            A CONDITIONAL block may return the one-based index of a branch to
            //            run, or it may return zero/falsy to run no branch.
            //          BlockType.EVENT - starts a stack in response to an event (full spec TBD)
            //          BlockType.LOOP - control flow, like "repeat {} {}" or "forever {}"
            //            A LOOP block is like a CONDITIONAL block with two differences:
            //            - the block is assumed to have exactly one child branch, and
            //            - each time a child branch finishes, the loop block is called again. */
            //     blockType: BlockType.REPORTER,
            //
            //     /* Required for CONDITIONAL blocks, ignored for others: the number of
            //        child branches this block controls. An "if" or "repeat" block would
            //        specify a branch count of 1; an "if-else" block would specify a
            //        branch count of 2.  分支数量 */
            //
            //     //    branchCount: 0,
            //
            //     /* 下边是不是不能接积木,默认为false */
            //
            //     //    terminal: true,
            //
            //     /* Optional, default false: whether or not to block all threads while
            //        this block is busy. This is for things like the "touching color"
            //        block in compatibility mode, and is only needed if the VM runs in a
            //        worker. We might even consider omitting it from extension docs... */
            //
            //     //    blockAllThreads: false,
            //
            //     /* Required: the human-readable text on this block, including argument
            //        placeholders. Argument placeholders should be in [MACRO_CASE] and
            //        must be [ENCLOSED_WITHIN_SQUARE_BRACKETS]. */
            //     text: translate({id: 'reporterBlock'}),
            //
            //     /* Required: describe each argument.
            //        Argument order may change during translation, so arguments are
            //        identified by their placeholder name. In those situations where
            //        arguments must be ordered or assigned an ordinal, such as interaction
            //        with Scratch Blocks, arguments are ordered as they are in the default
            //        translation (probably English). */
            //     arguments: {
            //         /* Required: the ID of the argument, which will be the name in the
            //            args object passed to the implementation function. */
            //         LETTER_NUM: {
            //             /* Required: type of the argument / shape of the block input */
            //             type: ArgumentType.NUMBER,
            //
            //             /* Optional: the default value of the argument */
            //             defaultValue: 1
            //         },
            //
            //         /* Required: the ID of the argument, which will be the name in the
            //            args object passed to the implementation function. */
            //         TEXT: {
            //             /* Required: type of the argument / shape of the block input */
            //             type: ArgumentType.STRING,
            //
            //             /* Optional: the default value of the argument */
            //             defaultValue: translate({id: 'myReporter.TEXT_default'})
            //         }
            //     }
            //
            //     /* Optional: the function implementing this block.
            //        If absent, assume 'func' is the same as 'opcode'.*/
            //
            //     //    func: 'myReporter',
            //
            //     /* Optional: list of target types for which this block should appear.
            //        If absent, assume it applies to all builtin targets -- that is:
            //        [TargetType.SPRITE, TargetType.STAGE] */
            //
            //     //    filter: [TargetType.SPRITE],
            // };
            const rightShiftZeroComplementOperator = {
                opcode: "rightShiftZeroComplementOperator",
                blockType: BlockType.REPORTER,
                text: "[NUM1]>>>[NUM2]",
                arguments: {
                    NUM1: {
                        type: ArgumentType.NUMBER,
                        defaultValue:8
                    },
                    NUM2: {
                        type: ArgumentType.NUMBER,
                        defaultValue:2
                    }
                }
            }

            return {
                /* Required: the machine-readable name of this extension.
                   Will be used as the extension's namespace.
                   Allowed characters are those matching the regular expression [w-]: A-Z, a-z, 0-9, and hyphen ("-"). */
                id: 'useful_blocks',

                /* Core extensions only: override the default extension block colors. */
                color1: '#14C0DE',
                color2: '#12C6E6',

                /* Optional: the human-readable name of this extension as string.
                   This and any other string to be displayed in the Scratch UI may either be
                   a string or a call to 'translate'; a plain string will not be
                   translated whereas a call to 'translate' will connect the string
                   to the translation map (see below). The 'translate' call is
                   similar to 'translate' from 'react-intl' in form, but will actually
                   call some extension support code to do its magic. For example, we will
                   internally namespace the messages such that two extensions could have
                   messages with the same ID without colliding.
                   See also: https://github.com/yahoo/react-intl/wiki/API#translate */
                name: translate({id: 'extensionName'}),

                /* Optional: URI for a block icon, to display at the edge of each block for this
                   extension. Data URI OK.
                   size  40x40, 1:1 aspect ratio
                */

                // blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

                /* Optional: URI for an icon to be displayed in the blocks category menu.
                   If not present, the menu will display the block icon, if one is present.
                   Otherwise, the category menu shows its default filled circle.
                   Data URI OK.
                   size  40x40, 1:1 aspect ratio
                */

                // menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

                /* Optional: Link to documentation content for this extension.
                   replace it with your document link */

                // docsURI: 'https://getgandi.com/',

                /* Required: the list of blocks implemented by this extension,
                   in the order intended for display. */
                blocks: [
                    rightShiftZeroComplementOperator
                ],
            };

        }

        rightShiftZeroComplementOperator(args) {
            return args.NUM1 >>> args.NUM2
        }
    }

    extensions.register(new UsefulBlocks(runtime));

}(Scratch));
