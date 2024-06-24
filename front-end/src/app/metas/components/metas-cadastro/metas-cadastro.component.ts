import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MetaInterface } from '../../types/metas.interface';
import { MetaService } from '../../services/metas.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-metas-cadastro',
  templateUrl: './metas-cadastro.component.html',
  styleUrls: ['./metas-cadastro.component.scss'],
})
export class MetasCadastroComponent implements OnInit {
  metaId: string | null;
  metasForm: FormGroup;
  pessoas: string[] = [];

  constructor(
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private metaService: MetaService,
    private router: Router,
    private http: HttpClient
  ) {
    this.metaId = null;
    this.metasForm = this.createForm();
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/pessoas').subscribe(
      (pessoas: any[]) => {
        this.pessoas = pessoas.map(pessoa => pessoa.nome);

        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) {
          this.metaId = id;
          this.metaService.getMeta(this.metaId).subscribe((meta: MetaInterface | undefined) => {
            if (meta) {
              this.metasForm = this.createForm(meta);
            } else {
              console.error("Meta não encontrada.");
            }
          });
        }

        this.metasForm.get('km')?.valueChanges.subscribe(() => {
          this.updateMedia();
        });
        this.metasForm.get('tempo')?.valueChanges.subscribe(() => {
          this.updateMedia();
        });
      },
      (erro) => {
        console.error(erro);
      }
    );
  }

  private createForm(meta?: MetaInterface) {
    return new FormGroup({
      nome: new FormControl(meta?.nome || '', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(150),
      ]),
      tempo: new FormControl(meta?.tempo || '', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]),
      km: new FormControl(meta?.km || '', [
        Validators.required,
        Validators.pattern(/^\d+(\.\d{1,2})?$/)
      ]),
      data_corrida: new FormControl(meta?.data_corrida ? new Date(meta.data_corrida).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10)),
      media: new FormControl(meta?.media || '', [
        Validators.required,
      ]),
      observacao: new FormControl(meta?.observacao || ''),
    });
  }

  updateMedia() {
    const kmValue = parseFloat(this.metasForm.get('km')?.value);
    const tempoValue = parseFloat(this.metasForm.get('tempo')?.value);
    if (!isNaN(kmValue) && !isNaN(tempoValue) && tempoValue !== 0) {
      const mediaValue = kmValue / tempoValue;
      this.metasForm.get('media')?.setValue(mediaValue.toFixed(2));
    } else {
      this.metasForm.get('media')?.setValue('');
    }
  }



  salvar() {
    if (this.metasForm.invalid) {
      this.exibirToastErro('Por favor, preencha corretamente todos os campos do formulário.');
      return;
    }
    // Converter os valores de km e tempo para números
    const km = parseFloat(this.metasForm.get('km')?.value);
    const tempo = parseFloat(this.metasForm.get('tempo')?.value);
  
    if (isNaN(km) || isNaN(tempo)) {
      this.exibirToastErro('Por favor, insira valores numéricos válidos para km e tempo.');
      return;
    }
  
    const meta: MetaInterface = {
      ...this.metasForm.value,
      km: km,
      tempo: tempo,
      data_corrida: this.metasForm.get('data_corrida')?.value
    };

    this.metaService.salvar(meta).subscribe(
      () => {
        this.router.navigate(['metas']);
      },
      (erro) => {
        console.error('Erro ao salvar:', erro);
        if (erro.error && erro.error.message) {
          this.exibirToastErro(erro.error.message);
        } else {
          this.exibirToastErro('Não foi possível salvar. Por favor, tente novamente mais tarde.');
        }
      }
    );
  }
  

  private async exibirToastErro(mensagem: string) {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 5000,
      keyboardClose: true,
      color: 'danger',
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }

  get nome() {
    return this.metasForm.get('nome');
  }
}
