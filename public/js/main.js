$(document).ready( function() {
    $('.delete-recipe').on('click', function(){
        let id = $(this).data('id');
        console.log(id);
        let url = '/delete/' + id;
        if (confirm('Delete Recipe?')) {
            $.ajax({
                url: url,
                type: 'DELETE',
                success: result => {
                    console.log('Deleting Recipe...');
                    window.location.href='/';
                },
                error: err => {
                    console.log(err);
                }
            });
        }
    });

    $('.edit-recipe').on('click', function(){
        $('#edit-form-name').val($(this).data('name'));
        $('#edit-form-ingredients').val($(this).data('ingredients'));
        $('#edit-form-directions').val($(this).data('directions'));
        $('#edit-form-id').val($(this).data('id'));
    })

});