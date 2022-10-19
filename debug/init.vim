let g:hoge = []
execute 'source' .. expand('<sfile>:h') .. '/skkeleton.vim'
function! s:handle(type, ...) abort
	let g:hoge = add(get(g:, 'hoge', []), [a:type, a:000])
  let g:hoge = add(get(g:, 'hoge', []), [getpos('.'), getline('.')])
endfunction

inoremap <C-a> <Cmd>let g:SkkeletonFunc = funcref('<SID>handle')<CR>
inoremap <C-s> <Cmd>let g:SkkeletonFunc = {...->0}

call skkeleton#config({'setUndoPoint': v:false})

function! Dump(list) abort
  new
  setlocal buftype=nofile bufhidden=hide noswapfile
  call setline(1, a:list->copy()->map('string(v:val)'))
endfunction

au ModeChanged * let g:hoge = add(get(g:, 'hoge', []), [expand('<amatch>'), getpos('.')])
